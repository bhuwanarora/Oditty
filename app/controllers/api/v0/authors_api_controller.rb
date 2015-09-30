module Api
	module V0
		class AuthorsApiController < ApplicationController
			def get_similar_authors
				user_uuid = params[:id]
				author_uuid = params[:author_id]
				if user_uuid && author_uuid
					info = AuthorApi.get_similar_authors(user_uuid, author_uuid)
					status = 200
				else
					info = {:message => "Invalid Request"}
					status = 400
				end
				render :json => info, :status => status
			end

			def get_details
				author_id = params[:id]
				user_id = session[:user_id]
				skip_count = params[:skip].to_i
				if skip_count.present? && (skip_count != 0)
					redis_params =
					{
						:id => author_id,
						:user_id => user_id,
						:skip_count => skip_count
					}
					info = RedisHelper::Author.get_author_books redis_params
					if info.nil?
						info = Api::V0::AuthorApi.get_author_books author_id, user_id, skip_count
						redis_params[:info] = info
						RedisHelper::Author.set_author_books redis_params
					end
				else
					redis_params =
					{
						:id => author_id,
						:user_id => user_id
					}
					info = RedisHelper::Author.get_details(redis_params)
					unless !info.nil?
						info = Api::V0::AuthorApi.get_details author_id, user_id
						redis_params[:info] = info
						RedisHelper::Author.set_details(redis_params)
					end
				end
				render :json => info, :status => 200
			end

			def get_basic_info
				id = params[:id]
				info = RedisHelper::Author.get_basic_info({:id => id})
				unless !info.nil?
					info = Api::V0::AuthorApi.get_basic_info id
					RedisHelper::Author.set_basic_info({:id => id, :info => info})
				end
				render :json => info, :status => 200
			end

			def get_popular_authors
				skip_count = params[:skip_count] || 0
				redis_params = {:id => skip_count }
				authors = RedisHelper::Author.get_popular(redis_params)
				if authors.nil?
					authors =  Api::V0::AuthorApi.get_active_authors(skip_count).execute
					redis_params[:info] = authors
					RedisHelper::Author.set_popular(redis_params)
				end
				render :json => authors, :status => 200
			end

			def details
				info = RedisHelper::Author.get_details_for_book(params[:book_id])
				if info.nil?
					info = AuthorApi.get_author_details_for_book params[:book_id]
					redis_params =
					{
						:id => params[:book_id],
						:info => info
					}
					RedisHelper::Author.set_details_for_book(redis_params)
				end
				render :json => info, :status => 200
			end

			def follow
				user_id = session[:user_id]
				id = params[:id]
				if params[:status].present? && params[:status]== "true"
					Api::V0::AuthorApi.follow(id, user_id).execute
					RedisHelper::Author.clear_details({:id => id })
					FeedHelper::UserFeedHelper.handle_redis({
						:user_id => user_id,
						:author_id => id,
						:action => FeedHelper::ActionCreate
						}, Constant::NodeLabel::FollowsNode)
				else
					FeedHelper::UserFeedHelper.handle_redis({
						:user_id => user_id,
						:author_id => id,
						:action => FeedHelper::ActionDelete
						}, Constant::NodeLabel::FollowsNode)
					Api::V0::AuthorApi.unfollow(id, user_id).execute
					RedisHelper::Author.clear_details({:id => id })
				end
				render :json => {:message => "Success"}, :status => 200
			end

			def get_interview_details
				author_id = params[:id]
				info = RedisHelper::Author.get_interview_details({:id => author_id})
				unless !info.nil?
					info = Api::V0::AuthorApi.get_interview_details(author_id)
					RedisHelper::Author.set_interview_details({:id => author_id, :info => info})
				end
				render :json => info, :status => 200
			end

			def get_authors_interviewed
				skip = params[:skip].to_i
				redis_params = {:id => skip}
				info = RedisHelper::Author.get_interviewed(redis_params)
				if info.nil?
					info = Api::V0::AuthorApi.get_interviewed(skip)
					redis_params[:info] = info
					RedisHelper::Author.set_interviewed(redis_params)
				end
				render :json => info, :status => 200			
			end
		end
	end
end