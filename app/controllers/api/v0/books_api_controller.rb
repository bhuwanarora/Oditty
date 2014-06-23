module Api
	module V0
		class BooksApiController < ApplicationController
			def get_similar_books
				user_uuid = params[:id]
				book_uuid = params[:book_id]
				if user_uuid && book_uuid
					info = BookApi.get_similar_books(user_uuid, book_uuid)
					status = 200
				else
					info = {:message => "Invalid Request"}
					status = 400
				end
				render :json => info, :status => status
			end

			def tooltip
				info = BookApi.tooltip
				render :json => info, :status => 200
			end

			def get_book_details
				id = params[:id]
				info = BookApi.detailed_book(id)
				render :json => info, :status => 200
			end

			def moments
				id = params[:id]
				info = BookApi.get_timeline(id)
				render :json => info, :status => 200
			end

			def affiliate_links
				id = params[:id]
				info = {:amazon => {:link => "", :price => ""},
						 :bnn => {:link => "http://www.betterworldbooks.com/ProductDetail.aspx?ItemId=" + id}}
				render :json => info, :status => 200
			end

		end
	end
end