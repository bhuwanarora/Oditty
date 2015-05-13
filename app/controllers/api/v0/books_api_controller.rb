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

			def books_on_signup
				user_id = session[:user_id]
				skip_count = JSON.parse(params["q"])["skip_count"]
				books = User::Predict::BookPrediction.new(user_id, skip_count).likely_books_read
				render :json => books, :status => 200
			end

			def update_visited
				book_id = params[:id]
				user_id = session[:user_id]
				if user_id.present?
					Bookmark::Type::Visited.new(user_id, book_id).book.add.execute
				end
				render :json => "Success", :status => 200
			end

			def get_popular_books
				# params = JSON.parse(params["q"])
				books = BookApi.get_popular_books(params, session[:user_id])
				render :json => books, :status => 200
			end

			def tooltip
				info = BookApi.tooltip
				render :json => info, :status => 200
			end

			def get_book_details
				id = params[:id]
				user_id = session[:user_id]
				info = BookApi.get_book_details(id, user_id)
				render :json => info, :status => 200
			end

			def get_basic_book_details
				id = params[:id]
				user_id = session[:user_id]
				info = BookApi.get_basic_book_details(id, user_id).execute[0]
				render :json => info, :status => 200
			end

			def moments
				id = params[:id]
				info = BookApi.get_timeline(id)
				render :json => info, :status => 200
			end

			def affiliate_links
				book = BookApi.get_book(params[:id])
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
				status = BookApi.create_thumb_request(params, session[:user_id])
				render :json => {:message => "Request Initiated...", :status => 200}
			end

			def get_feed
				feed = BookApi.get_feed params[:id]
				render :json => feed, :status => 200
			end

			def get_root_categories
				book_id = params[:book_id]
				data = CategoriesHelper.get_categories book_id
				render :json => data, :status => 200
			end

			def get_interesting_info
				book_id = params[:id]
				data = BookApi.get_interesting_info book_id
				render :json => data, :status => 200
			end
		end
	end
end