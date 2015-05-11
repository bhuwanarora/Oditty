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
				skip_count = params[:skip]
				unless skip_count.present?
					info = Api::V0::AuthorApi.get_details author_id, user_id
				else
					info = Api::V0::AuthorApi.get_author_books author_id, user_id, skip_count
				end
				render :json => info, :status => 200
			end

			def get_popular_authors
				skip_count = params[:skip_count] || 0
				authors =  Api::V0::Author.get_active_authors(skip_count).execute
				render :json => authors, :status => 200
			end

			def details
				info = AuthorApi.get_author_details_for_book params[:book_id]
				render :json => info, :status => 200
			end

		end
	end
end