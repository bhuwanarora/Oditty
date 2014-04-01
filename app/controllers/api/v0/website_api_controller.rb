module Api
	module V0
		class WebsiteApiController < ApplicationController
			def genres
				filter = params[:q]
				genres = [{:name => "Philosophy", :id => 1}, 
						  {:name => "Arts", :id => 2},
						  {:name => "Music", :id => 3},
						  {:name => "Fiction", :id => 4},
						  {:name => "Non-fiction", :id => 5}]
				results = {:genres => genres}
				render :json => results, :status => 200
			end

			def countries
				filter = params[:q]
				countries = [{:name => "India", :id => 1}, {:name => "United States Of America", :id => 2}]
				results = {:countries => countries}
				render :json => results, :status => 200
			end

			def get_user_details
				# user_id = params[:user_id]
				
				bookmarked_books = test_books
				read_books = test_books
				render :json => {:books => {:bookmarked => [], :read => read_books}}, :status => 200
			end

			def authenticate
				render :json => {:message => "success", :profile_status => 0, :user_id => 1}, :status => 200
			end

			def update_profile
				profile_status = params[:user['profile_status']]
				profile_status = profile_status + 1;
				render :json => {:message => "success", :profile_status => profile_status, :user_id => 1}, :status => 200
			end

			private
				def test_books
					# filters list Filter.where(:id => JSON.parse(params[:q])["more_filters"])
					# test_name = Filter.where(:id => JSON.parse(params[:q])["more_filters"]).pluck(:name) rescue "City"

					test_book = {:title => "test_name[0]",
								  :author_name => "P. D. Smith",
							  }
					test_book1 = test_book.merge(
						:book_cover_url => "assets/books/20.jpeg",
						:id => 1)

					test_book2 = test_book.merge(
						:book_cover_url => "assets/books/10.jpg",
						:id => 2)


					test_book3 = test_book.merge(
						:book_cover_url => "assets/books/11.jpeg",
						:id => 3)


					test_book4 = test_book.merge(
						:book_cover_url => "assets/books/13.jpeg",
						:id => 4)


					test_book5 = test_book.merge(
						:book_cover_url => "assets/books/24.jpg",
						:id => 5)


					count = params[:count]
					[test_book1, test_book2, test_book3, test_book4, test_book5]
				end

		end
	end
end