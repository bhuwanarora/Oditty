module Api
	module V0
		class UsersApiController < ApplicationController
			def authenticate

			end

			def bookmark_action
				bookmark_action = params[:q]
				user_id = session[:user_id]
				book_id = params[:book_id]
				if bookmark_action
					UsersGraphHelper.mark_as_read(user_id, book_id)
				else
					UsersGraphHelper.mark_as_unread(user_id, book_id)
				end
				render :json => {:message => "Success"}, :status => 200
			end

			def mark_as_read_action
				mark_as_read_action = params[:q]
				user_id = session[:user_id]
				book_id = params[:book_id]
				if mark_as_read_action
					UsersGraphHelper.mark_as_read(user_id, book_id)
				else
					UsersGraphHelper.mark_as_unread(user_id, book_id)
				end
				render :json => {:message => "Success"}, :status => 200
			end

			def follow_action
				follow_action = params[:q]
				user2_id = params[:user_id]
				user1_id = session[:user_id]
				if follow_action
					UsersGraphHelper.follow_user(user1_id, user2_id)
				else
					UsersGraphHelper.unfollow_user(user1_id, user2_id)
				end
				render :json => {:message => "Success"}, :status => 200
			end

			def comment_on_discussion
				discussion_id = params[:discussion_id]
				comment = params[:comment]
				user_id = session[:user_id]
				UsersGraphHelper.comment_on_discussion(discussion_id, comment)
				render :json => {:message => "Success"}, :status => 200
			end

			def create_discussion
				user_id = session[:user_id]
				book_id = params[:book_id]
				discussion_id = params[:discussion_id]
				UsersGraphHelper.initiate_discussion(user_id, book_id, discussion_id)
				render :json => {:message => "Success"}, :status => 200
			end

			def write_a_review
				user_id = session[:user_id]
				book_id = params[:book_id]
				review = params[:review]
				UsersGraphHelper.write_a_review(user_id, book_id, review)
				render :json => {:message => "Success"}, :status => 200
			end

			def edit_a_review
				user_id = session[:user_id]
				book_id = params[:book_id]
				review = params[:review]
				UsersGraphHelper.edit_a_review(user_id, book_id, review)
				render :json => {:message => "Success"}, :status => 200
			end

			def comment_on_review
				user_id = session[:user_id]
				book_id = params[:book_id]
				review = params[:review]
				UsersGraphHelper.comment_on_review(user_id, review_id, comment)
				render :json => {:message => "Success"}, :status => 200
			end

			def like
				user_id = session[:user_id]
				id = params[:id]
				type = params[:type]
				if type == "discussion"
					UsersGraphHelper.like_discussion(user_id, id)
				elsif type == "review"
					UsersGraphHelper.like_review(user_id, id)
				end
						
				render :json => {:message => "Success"}, :status => 200
			end

			def dislike
				user_id = session[:user_id]
				id = params[:id]
				type = params[:type]
				if type == "discussion"
					UsersGraphHelper.dislike_discussion(user_id, id)
				elsif type == "review"
					UsersGraphHelper.dislike_review(user_id, id)
				end
						
				render :json => {:message => "Success"}, :status => 200
			end
		end
	end
end