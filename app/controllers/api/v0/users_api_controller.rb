module Api
	module V0
		class UsersApiController < ApplicationController

			def google_auth
				params[:access_token]
			end

			def books_read
				user_id = session[:user_id]
				info = UsersGraphHelper.get_books_read(user_id, params[:skip_count])
				render :json => info, :status => 200
			end

			def own
				render :json => {:message => "Success"}, :status => 200
			end

			def recommend
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
				UsersGraphHelper.rate_book(user_id, book_id, rating)
				render :json => {:message => "Success"}, :status => 200
			end

			def bookmark
				type = params[:type]
				bookmark_action = params[:data]
				user_id = session[:user_id]
				book_id = params[:id]
				name = params[:name]
				if type == "BOOK"
					if bookmark_action
						UsersGraphHelper.bookmark_book(user_id, book_id, name)
					else
						UsersGraphHelper.remove_bookmark(user_id, book_id, name)
					end
				elsif type == "AUTHOR"
				elsif type == "READER"
				end
				render :json => {:message => "Success"}, :status => 200
			end

			def mark_as_read
				mark_as_read_action = params[:data]
				user_id = session[:user_id]
				book_id = params[:book_id]
				if mark_as_read_action
					UsersGraphHelper.mark_as_read(user_id, book_id)
				else
					UsersGraphHelper.mark_as_unread(user_id, book_id)
				end
				render :json => {:message => "Success"}, :status => 200
			end

			def follow
				# follow_action = params[:q]
				# user2_id = params[:user_id]
				# user1_id = session[:user_id]
				# if follow_action
				# 	UsersGraphHelper.follow_user(user1_id, user2_id)
				# else
				# 	UsersGraphHelper.unfollow_user(user1_id, user2_id)
				# end
				render :json => {:message => "Success"}, :status => 200
			end

			def comment
 				user_id = session[:user_id]
				UsersGraphHelper.comment_on_book(user_id, params[:id], params[:tweet])
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
				logged_in = false
				if session[:user_id]
					logged_in = true
				end
				render :json => {:logged_in => logged_in, :id => session[:user_id]}, :status => 200
			end

			def get_news_feed
				user_id = session[:user_id]
				UsersGraphHelper.get_news_feed_for_user(user_id)
				render :json => {:message => "Success"}, :status => 200
			end

			def get_most_connected_friends
				info = UserApi.get_most_connected_friends
				render :json => info, :status => 200
			end

			def get_info_card_data
				info = UserApi.get_info_card_data
				render :json => info, :status => 200
			end
		end
	end
end