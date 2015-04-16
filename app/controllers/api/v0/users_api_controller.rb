module Api
	module V0
		class UsersApiController < ApplicationController

			def get_info_card_data
				info = UserApi.get_info_card_data
				render :json => info, :status => 200
			end

			def get_small_reads
				user_id = session[:user_id]
				books = UserApi.get_small_reads
				render :json => books, :status => 200
			end

			def get_feed
				user_id = session[:user_id]
				info = UserApi.get_feed(user_id)
				render :json => info, :status => 200
			end

			def bookmark
				params = params["q"]
				params = JSON.parse params
				id = params["id"]
				type = params["type"]
				shelf = params["shelf"]
				status = params["status"]
				user_id = session[:user_id]
				if status == "true"
					UserApi.add_bookmark(user_id, id, type, shelf)
				else
					UserApi.remove_bookmark(user_id, id, type, shelf)
				end
				render :json => {:message => "Success"}, :status => 200
			end

			def handle_influential_books
				book_id = params[:id]
				status = params[:status]
				user_id = session[:user_id]
				if status == "true"
					info = Bookmark::Type::HaveLeftAMarkOnMe.new(user_id, book_id).add.execute
				else
					info = Bookmark::Type::HaveLeftAMarkOnMe.new(user_id, book_id).remove.execute
				end
				render :json => info, :status => 200
			end

			def get_books_from_favourite_author
				user_id = session[:user_id]
				books = User::Suggest::BookSuggestion.new(user_id).for_favourite_author.execute
				render :json => books, :status => 200
			end

			def get_books_from_likeable_category
				user_id = session[:user_id]
				favourites = true
				books = Api::V0::UserApi.get_likeable_category(user_id, favourites)
				render :json => books, :status => 200
			end

			def get_books_from_favourite_era
				user_id = session[:user_id]
				books = User::Suggest::BookSuggestion.new(user_id).for_most_bookmarked_era.execute
				render :json => books, :status => 200
			end

			def get_books_on_friends_shelves
				user_id = session[:user_id]
				books = User::Suggest::BookSuggestion.new(user_id).on_friends_shelves.execute
				render :json => books, :status => 200
			end

			def get_books_from_unexplored_subjects
				user_id = session[:user_id]
				favourites = false
				books = Api::V0::UserApi.get_books_from_unexplored_subjects(user_id, favourites)
				render :json => books, :status => 200
			end

			def get_user_details
				if params[:id]
					info = UserApi.get_details(params[:id], session)
				else
					info = UserApi.get_details(session[:user_id], session)
				end
				render :json => info, :status => 200
			end


			def user_profile_info
				user_id = session[:user_id]
				info = UserApi.get_profile_info(user_id)
				render :json => info, :status => 200
			end

			def authenticate
				authentication_info = Api::V0::UserApi.authenticate(session, params)
				if authentication_info[:authenticate]
					render :json => authentication_info, :status => 200
				else
					render :json => authentication_info, :status => 403
				end
			end

			def update_profile
				profile_status = params[:user['profile_status']]
				profile_status = profile_status + 1;
				render :json => {:message => "success", :profile_status => profile_status, :user_id => 1}, :status => 200
			end

			def image
				# image_url = SearchPage.all(:order => "RANDOM()").first.background_image_url
				neo = Neography::Rest.new
				r = Random.new
				random = r.rand(1...8)
				clause = "MATCH (c:CoverPhoto) WHERE c.status = true RETURN ID(c) SKIP "+random.to_s+" LIMIT 1"
				puts clause.blue.on_red
				id = neo.execute_query(clause)["data"]
				puts id.to_s.green
				render :json => id, :status => 200
			end

			def google
				user_id = UserApi.handle_google_user params
				puts user_id.to_s.red
				session[:user_id] = user_id
				render :json => {:message => "Success"}, :status => 200
			end

			def notifications
				if session[:user_id]
					info = UserApi.get_notifications session[:user_id]
				else
					info = {:message => Constant::StatusMessage::SessionNotSet}
				end
				render :json => info, :status => 200
			end

			def save_info
				user_id = UserApi.save_info(session[:user_id], params)
				render :json => {:message => "Success"}, :status => 200
			end

			def fb
				user_id = UserApi.handle_facebook_user(params, session)
				session[:user_id] = user_id
				if user_id.present?
					render :json => {:message => "Success"}, :status => 200
				else
					render :json => {:message => "Login Failure"}, :status => 500
				end
			end

			def books_read
				user_id = params[:id]
				info = UsersGraphHelper.get_books_read(user_id, params[:skip_count])
				render :json => info, :status => 200
			end

			def books_bookmarked
				user_id = params[:id]
				info = UsersGraphHelper.get_books_bookmarked(user_id, params[:skip_count])
				render :json => info, :status => 200
			end

			def own
				render :json => {:message => "Success"}, :status => 200
			end

			def recommend
				UserApi.recommend_book(session[:user_id], params[:friend_ids], params[:book_id])
				render :json => {:message => "Success"}, :status => 200
			end

			def time
				user_id = session[:user_id]
				book_id = params[:id]
				time = params[:data]
				UsersGraphHelper.record_time(user_id, book_id, time)
				render :json => {:message => "Success"}, :status => 200
			end

			def rate
				user_id = session[:user_id]
				book_id = params[:id]
				rating = params[:data]
				Api::V0::UserApi.rate_book(book_id, user_id, rating).execute
				render :json => {:message => "Success"}, :status => 200
			end

			def follow
				follow_action = params[:q] 
				friend_id = params[:id] 
				user_id = session[:user_id]
				if follow_action
					Api::V0::UserApi.follow_user(user_id, friend_id).execute
				else
					Api::V0::UserApi.unfollow_user(user_id, friend_id).execute
				end
				render :json => {:message => "Success"}, :status => 200
			end

			def comment
 				user_id = session[:user_id]
 				UserApi.comment_on_book(user_id, params)
				render :json => {:message => "Success"}, :status => 200
			end

			def what_do_you_feel_about_this_book
				# user_id = session[:user_id]
				# book_id = params[:book_id]
				# discussion_id = params[:discussion_id]
				# UsersGraphHelper.initiate_discussion(user_id, book_id, discussion_id)
				render :json => {:message => "Success"}, :status => 200
			end

			def post_review
				# user_id = session[:user_id]
				# book_id = params[:book_id]
				# review = params[:review]
				# UsersGraphHelper.write_a_review(user_id, book_id, review)
				render :json => {:message => "Success"}, :status => 200
			end

			def edit_review
				# user_id = session[:user_id]
				# book_id = params[:book_id]
				# review = params[:review]
				# UsersGraphHelper.edit_a_review(user_id, book_id, review)
				render :json => {:message => "Success"}, :status => 200
			end

			def like
				# user_id = session[:user_id]
				# id = params[:id]
				# type = params[:type]
				# if type == "discussion"
				# 	UsersGraphHelper.like_discussion(user_id, id)
				# elsif type == "review"
				# 	UsersGraphHelper.like_review(user_id, id)
				# end
				render :json => {:message => "Success"}, :status => 200
			end

			def dislike
				# user_id = session[:user_id]
				# id = params[:id]
				# type = params[:type]
				# if type == "discussion"
				# 	UsersGraphHelper.dislike_discussion(user_id, id)
				# elsif type == "review"
				# 	UsersGraphHelper.dislike_review(user_id, id)
				# end
						
				render :json => {:message => "Success"}, :status => 200
			end

			def user_info
				render :json => {:message => "Success"}, :status => 200
			end

			def user
				# session[:user_id] = nil
				logged_in = false
				puts "SESSION USER ID "+session[:user_id].to_s.blue.on_red
				if session[:user_id]
					logged_in = true
				end
				render :json => {:logged_in => logged_in, :id => session[:user_id]}, :status => 200
			end

			def logout
				session[:user_id] = nil
				render :json => {:logged_out => true}, :status => 200
			end

			def recover_password
				message = Api::V0::UserApi.recover_password(params[:email])
				render :json => {:message => message}, :status => 200
			end

			# def get_news_feed
			# 	user_id = session[:user_id]
			# 	debugger
			# 	UsersGraphHelper.get_news_feed_for_user(user_id)
			# 	render :json => {:message => "Success"}, :status => 200
			# end

			def get_most_connected_friends
				if (params[:id] == "undefined") || !params[:id].present?
					user_id = session[:user_id]
				else
					user_id = params[:id]
				end
				info = UserApi.get_most_connected_friends(user_id, params[:count], params[:skip])
				render :json => info, :status => 200
			end

			def endorse_book
				user_id = session[:user_id]
				book_id = params[:id]
				status =  params[:status]
				if status 
					info = Api::V0::UserApi.endorse_book(book_id, user_id).execute
				else
					info = Api::V0::UserApi.remove_endorse(book_id, user_id).execute
				end
				render :json => info, :status => 200
			end

			def get_followed_by
				info = UserApi.get_followed_by session[:user_id]
				render :json => info, :status => 200
			end

			def get_sorted_genres
				user_id = session[:user_id]
				genres = CategoriesHelper.get_sorted_genres user_id
				render :json => genres, :status => 200
			end

			def get_influential_books
				user_id = session[:user_id]
				influential_books = UserApi.get_influential_books(user_id).execute
				render :json => influential_books, :status => 200
			end

			def verify
				verification_info = Api::V0::UserApi.verify(session, params)
				render :json => verification_info, :status => 200
			end

			def get_followers
				user_id = session[:user_id]
				info = Api::V0::UserApi.get_followers(user_id).execute
				render :json => info, :status => 200
			end

			def get_users_followed
				user_id = session[:user_id]
				info = Api::V0::UserApi.get_users_followed(user_id).execute
				render :json => info, :status => 200
			end
		end
	end
end