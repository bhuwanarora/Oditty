module Api
	module V0
		class UsersApiController < ApplicationController

			def social_books
				user_id = session[:user_id]
				if user_id
					info = Api::V0::UserApi.get_social_books user_id
				else
					info = []
				end
				render :json => info, :status => 200
			end

			def get_info_card_data
				info = Api::V0::UserApi.get_info_card_data
				render :json => info, :status => 200
			end

			def invite
				user_id = session[:user_id]
				info = Api::V0::UserApi.invite(params, user_id)
				render :json => {:message => "Success"}, :status => 200
			end

			def get_social_feed
				if session[:user_id]
					url = Rails.application.config.feed_service+"/api/v0/get_social_feed?skip="+params[:skip].to_s+"&count="+params[:count].to_s+"&user_id="+session[:user_id].to_s
					info = Net::HTTP.get(URI.parse(url))
				else
					info = []
				end
				render :json => info, :status => 200
			end

			def get_global_feed
				url = Rails.application.config.feed_service+"/api/v0/get_global_feed?skip="+params[:skip].to_s+"&count="+params[:count].to_s
				info = Net::HTTP.get(URI.parse(url))
				render :json => info, :status => 200
			end

			def set_intro_seen_status
				user_id = session[:user_id]
				status = params[:q]
				Api::V0::UserApi.set_intro_seen_status(user_id, status).execute
				render :json => {:message => "Success"}, :status => 200
			end

			def get_bookmarks
				user_id = session[:user_id]
				if user_id.present?
					type = params[:type] || "News"
					id = params[:id]
					info = Api::V0::UserApi.get_bookmarks(id, user_id, type).execute
					render :json => info, :status => 200
				else
					redirect_to :controller => 'website', :action => 'signup'			
				end
			end

			def get_small_reads
				user_id = session[:user_id]
				books = Api::V0::UserApi.get_small_reads
				render :json => books, :status => 200
			end

			def get_feed
				user_id = session[:user_id]
				skip_count = session[:skip_count] || 0
				info = Api::V0::UserApi.get_feed(user_id, skip_count).execute
				render :json => info, :status => 200
			end

			def news_visited
				news_id = params[:id]
				user_id = session[:user_id]
				UserApi.news_visited(user_id, news_id)
				render :json => {:message => "Success"}, :status => 200
			end

			def bookmark
				id = params["id"]
				type = params["type"].to_s.upcase
				shelf = params["shelf"].to_s.upcase
				status = params["status"]
				user_id = session[:user_id]
				if status 
					Api::V0::UserApi.add_bookmark(user_id, id, type, shelf).execute
					FeedHelper::UserFeedHelper.handle_redis({
						:user_id => user_id,
						:media_id => id,
						:action => FeedHelper::ActionCreate
						}, Constant::NodeLabel::BookmarkNode)
				else
					FeedHelper::UserFeedHelper.handle_redis({
						:user_id => user_id,
						:media_id => id,
						:action => FeedHelper::ActionDelete
						}, Constant::NodeLabel::BookmarkNode)
					Api::V0::UserApi.remove_bookmark(user_id, id, type, shelf).execute
				end
				
				if params[:parent]
					Api::V0::UserApi.add_book_searched(user_id, id).execute
				end
				render :json => {:message => "Success"}, :status => 200
			end

			def handle_influential_books
				book_id = params[:id]
				status = params[:status]
				user_id = session[:user_id]
				if status == "true"
					info = Bookmark::Type::HaveLeftAMarkOnMe.new(user_id, book_id).book.add.execute
				else
					info = Bookmark::Type::HaveLeftAMarkOnMe.new(user_id, book_id).book.remove.execute
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
				if session[:user_id]
					if params[:id]
						info = Api::V0::UserApi.get_relative_details(params[:id], session[:user_id])
					else
						info = RedisHelper.get_user_details({:id => session[:user_id]})
						unless !info.nil?
							info = UserApi.get_details(session[:user_id])
							RedisHelper.set_user_details({:id => session[:user_id], :info => info})
						end
					end
				else
					info = RedisHelper.get_user_details({:id => params[:id]})
					unless !info.nil?
						info = UserApi.get_details(params[:id])
						RedisHelper.set_user_details({:id => params[:id], :info => info})
					end
				end
				render :json => info, :status => 200
			end


			def user_profile_info
				if params[:id].present?
					user_id = params[:id]
					info = Api::V0::UserApi.get_profile_info_of_another(session[:user_id], user_id)
				else
					user_id = session[:user_id]
					info = Api::V0::UserApi.get_profile_info(user_id)
				end
				render :json => info, :status => 200
			end

			def authenticate
				authentication_info = Api::V0::UserApi.authenticate(params)
				if authentication_info[:authenticate]
					session[:user_id] = authentication_info[:user]["id"]
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
				user_id = Api::V0::UserApi.handle_google_user params
				puts user_id.to_s.red
				session[:user_id] = user_id
				render :json => {:message => "Success"}, :status => 200
			end

			def notifications
				if session[:user_id]
					info = Api::V0::UserApi.get_notifications session[:user_id]
				else
					info = {:message => Constant::StatusMessage::SessionNotSet}
				end
				render :json => info, :status => 200
			end

			def save_info
				user_id = Api::V0::UserApi.save_info(session[:user_id], params)
				render :json => {:message => "Success"}, :status => 200
			end

			def fb
				info = Api::V0::UserApi.handle_facebook_user(params[:users_api])
				session[:user_id] = info["id"]
				if info["id"].present?
					render :json => info, :status => 200
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
				UserApi.recommend_book(session[:user_id], params[:friends_id], params[:book_id])
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
				FeedHelper::UserFeedHelper.handle_redis({
						:user_id => user_id,
						:book_id => book_id,
						:action => FeedHelper::ActionCreate
						}, Constant::NodeLabel::RatingNode)
				render :json => {:message => "Success"}, :status => 200
			end

			def follow_community
				user_id = session[:user_id]
				community_id = params[:id]
				status = params[:status].downcase if params[:status]
				if status == "false"
					FeedHelper::UserFeedHelper.handle_redis({
						:user_id => user_id,
						:community_id => community_id,
						:action => FeedHelper::ActionDelete
						}, Constant::NodeLabel::FollowsNode)
				end
				Api::V0::UserApi.follow_community(user_id, community_id, status).execute
				if status == "true"
					FeedHelper::UserFeedHelper.handle_redis({
						:user_id => user_id,
						:community_id => community_id,
						:action => FeedHelper::ActionCreate
						}, Constant::NodeLabel::FollowsNode)
				end
				RedisHelper.delete_basic_community_info({:id => community_id})
				render :json => {:message => "Success"}, :status => 200
			end

			def follow
				follow_action = params[:status].to_s
				friend_id = params[:id] 
				user_id = session[:user_id]
				if follow_action.present? && follow_action == "true"
					Api::V0::UserApi.follow_user(user_id, friend_id).execute
					FeedHelper::UserFeedHelper.handle_redis({
						:user_id => user_id,
						:friend_id => friend_id,
						:action => FeedHelper::ActionCreate
						}, Constant::NodeLabel::FollowsNode)
				elsif follow_action.present? && follow_action == "false"
					FeedHelper::UserFeedHelper.handle_redis({
						:user_id => user_id,
						:friend_id => friend_id,
						:action => FeedHelper::ActionDelete
						}, Constant::NodeLabel::FollowsNode)
					Api::V0::UserApi.unfollow_user(user_id, friend_id).execute
				end
				RedisHelper.delete_friend_of_friend_details({:id => user_id })
				RedisHelper.delete_user_details({:id => user_id })
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
				render :json => message, :status => 200
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
					FeedHelper::UserFeedHelper.handle_redis({
						:user_id => user_id,
						:book_id => book_id,
						:action => FeedHelper::ActionCreate
						}, Constant::NodeLabel::EndorseNode)
				else
					FeedHelper::UserFeedHelper.handle_redis({
						:user_id => user_id,
						:book_id => book_id,
						:action => FeedHelper::ActionDelete
						}, Constant::NodeLabel::EndorseNode)
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

			def get_followers
				user_id = (params[:id].present?)? params[:id] : session[:user_id]
				skip_count = params[:skip] || 0
				if user_id
					info = Api::V0::UserApi.get_followers(user_id, skip_count).execute
				else
					info = []
				end
				render :json => info, :status => 200
			end

			def get_users_followed
				user_id = (params[:id].present?)? params[:id] : session[:user_id]
				skip_count = params[:skip] || 0
				if user_id
					info = Api::V0::UserApi.get_users_followed(user_id, skip_count).execute
				else
					info = []
				end
				render :json => info, :status => 200
			end

			def get_lenders
				user_id = session[:user_id]
				book_id = params[:id]
				info = Api::V0::UserApi.get_lenders(book_id, user_id).execute
				render :json => info, :status => 200
			end

			def notify_borrow
				user_id = session[:user_id]
				book_id = params[:id]
				info = Api::V0::UserApi.notify_borrow(book_id, user_id).execute
				render :json => info, :status => 200
			end

			def set_region
				region = params[:id]
				user_id = session[:user_id]
				remote_ip = request.remote_ip
				info = Api::V0::UserApi.set_region(user_id, region, remote_ip).execute
				render :json => info, :status => 200
			end

			def get_communities
				user_id = params[:id] || session[:user_id]
				if user_id
					info = Api::V0::UserApi.get_communities user_id
				else
					info = []
				end
				render :json => info, :status => 200
			end

			def search_friends
				user_id = session[:user_id]
				search_text = params[:q]
				info = Api::V0::UserApi.search_friends(user_id, search_text)
				render :json => info, :status => 200
			end

			def get_friends_of_friend
				user_id = session[:user_id]
				if user_id
					info = RedisHelper.get_friend_of_friend_details({:id => session[:user_id]})
					unless !info.nil?
						info = Api::V0::UserApi.get_friends_of_friend(user_id)
						RedisHelper.set_friend_of_friend_details({:id => session[:user_id], :info => info})
					end
				else
					info = []
				end
				render :json => info, :status => 200
			end
		end
	end
end