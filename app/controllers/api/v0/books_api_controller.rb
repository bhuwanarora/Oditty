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

			def get_popular_books
				books = BookApi.get_popular_books params
				render :json => books, :status => 200
			end

			def tooltip
				info = BookApi.tooltip
				render :json => info, :status => 200
			end

			def get_book_details
				id = params[:id]
				info = BookApi.get_book_details(id)
				render :json => info, :status => 200
			end

			def moments
				id = params[:id]
				info = BookApi.get_timeline(id)
				render :json => info, :status => 200
			end

			def affiliate_links
				book = BookApi.get_book(params[:title], params[:author_name])
				isbn =  book[0][0]["data"]["isbn"] rescue ""
				bnn_links = []
				if isbn
					for isbn in isbn.split(",")
						bnn_links |= ["http://www.betterworldbooks.com/ProductDetail.aspx?ItemId=" + isbn]
					end
				end
				info = {:amazon => {:link => "", :price => ""},
						 :bnn => {:links => bnn_links}}
				render :json => info, :status => 200
			end

			def add_thumbnail
				status = BookApi.create_thumb_request params
				render :json => {:message => "Request Initiated...", :status => 200}
			end

		end
	end
end