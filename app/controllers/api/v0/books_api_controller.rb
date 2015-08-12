module Api
	module V0
		class BooksApiController < ApplicationController
			
			def get_similar_books
				user_uuid = params[:id]
				book_uuid = params[:book_id]
				if user_uuid && book_uuid
					info = Api::V0::BookApi.get_similar_books(user_uuid, book_uuid)
					status = 200
				else
					info = {:message => "Invalid Request"}
					status = 400
				end
				render :json => info, :status => status
			end

			def map_fb_book
				book_data = params[:book]
				Api::V0::FacebookApi.map_fb_book book_data
				render :json => "Success", :status => 200
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
				books = Api::V0::BookApi.get_popular_books(params, session[:user_id])
				render :json => books, :status => 200
			end

			def tooltip
				info = Api::V0::BookApi.tooltip
				render :json => info, :status => 200
			end

			def get_book_details
				id = params[:id]
				user_id = session[:user_id]
				info = Api::V0::BookApi.get_book_details(id, user_id)
				render :json => info, :status => 200
			end

			def get_basic_feed_info
				id = params[:id]
				info = RedisHelper.get_basic_feed_book_info({:id => id})
				unless info
					info = Api::V0::BookApi.get_basic_feed_info(id)
					RedisHelper.set_basic_feed_book_info({:id => id, :info => info})
				end
				render :json => info, :status => 200
			end

			def get_primary_info
				id = params[:id]
				info = RedisHelper.get_book_primary_info({:id => id})
				unless info
					info = Api::V0::BookApi.get_primary_info(id)
					RedisHelper.set_book_primary_info({:id => id, :info => info}) if info
				end
				render :json => info, :status => 200
			end

			def affiliate_links
				book = Api::V0::BookApi.get_book(params[:id])
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
				status = Api::V0::BookApi.create_thumb_request(params, session[:user_id])
				render :json => {:message => "Request Initiated...", :status => 200}
			end

			def get_feed
				feed = Api::V0::BookApi.get_feed params[:id]
				render :json => feed, :status => 200
			end

			def get_root_categories
				book_id = params[:book_id]
				data = CategoriesHelper.get_categories book_id
				render :json => data, :status => 200
			end

			def get_interesting_info
				book_id = params[:id]
				info = RedisHelper.get_book_interesting_info({:id => book_id})
				unless info
					info = Api::V0::BookApi.get_interesting_info book_id
					RedisHelper.set_book_interesting_info({:id => book_id, :info => info})
				end
				render :json => info, :status => 200
			end

			def get_book_by_isbn
				isbn = params[:isbn]
				status = 500
				begin
					info = Api::V0::BookApi.get_book_info_by_isbn(isbn)
					status = 200
				rescue Exception => e
					puts e.to_s.red
				end
				render :json => info, :status => 200
			end
		end
	end
end