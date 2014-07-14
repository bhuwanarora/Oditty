module Api
	module V0
		class UsersApiController < ApplicationController

			def google_auth
				params[:access_token]
			end

			def own
				render :json => {:message => "Success"}, :status => 200
			end

			def recommend
				render :json => {:message => "Success"}, :status => 200
			end

			def time
				render :json => {:message => "Success"}, :status => 200
			end

			def rate
				render :json => {:message => "Success"}, :status => 200
			end

			def bookmark
				# bookmark_action = params[:q]
				# user_id = session[:user_id]
				# book_id = params[:book_id]
				# if bookmark_action
				# 	UsersGraphHelper.mark_as_read(user_id, book_id)
				# else
				# 	UsersGraphHelper.mark_as_unread(user_id, book_id)
				# end
				render :json => {:message => "Success"}, :status => 200
			end

			def mark_as_read
				mark_as_read_action = params[:data]
				user_id = session[:user_id]
				book_id = params[:book_id]
				if mark_as_read_action == 1
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
				# discussion_id = params[:discussion_id]
				# comment = params[:comment]
				# user_id = session[:user_id]
				# UsersGraphHelper.comment_on_discussion(discussion_id, comment)
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