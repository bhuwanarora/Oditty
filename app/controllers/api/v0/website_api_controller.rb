module Api
	module V0
		class WebsiteApiController < ApplicationController
			def genres
                @neo ||= neo_init
				filter = params[:q]
                genres = SearchApi.search_genres filter
                
				results = {:genres => genres}
				render :json => results, :status => 200
			end

			def trends
				trends = TrendsHelper.social_mention
				render :json => trends, :status => 200
			end

			def countries
				filter = params[:q]
				results = {:countries => CountryGroup.all}
				render :json => results, :status => 200
			end

            def labels
                labels = WebsiteApi.get_labels
                results = {:labels => labels}
                render :json => results, :status => 200
            end

            def times
                time_groups = WebsiteApi.get_time_groups
                results = {:times => time_groups}
                render :json => results, :status => 200
            end

            def read_times
                @neo ||= neo_init
                clause = "MATCH (r:ReadTime) RETURN r"
                read_times = @neo.execute_query(clause)["data"]
                results = {:read_times => read_times}
                render :json => results, :status => 200
            end

			def get_user_details
				# user_id = params[:user_id]
				
				bookmarked_books = BookApi.bookmarked_books
				read_books = []
				render :json => {:books => {:bookmarked => bookmarked_books, :read => read_books}}, :status => 200
			end

			def authenticate
				authentication_info = UserApi.authenticate(session, params)
				if authentication_info[:authenticate]
					render :json => authentication_info, :status => 200
				else
					render :json => authentication_info, :status => 403
				end
			end

			def update_profile
				profile_status = params[:user['profile_status']]
				profile_status = profile_status + 1;
				render :json => {:message => "success", :profile_status => profile_status, :user_id => 1}, :status => 200
			end

			def image
				image_url = SearchPage.all(:order => "RANDOM()").first.background_image_url
				render :json => {:url => image_url}, :status => 200
			end

			def notifications
				notifications = [
					{
						:thumb => "assets/profile_pic.jpeg",
						:user => "",
						:message => "Test User1 added book to his reading shelf, and gave 4 rating to the book.",
						:timestamp => "2 days ago",
						:category_id => 1
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "Test User4 recommended you Test-BookA by Test-AuthorB",
						:timestamp => "3 days ago",
						:category_id => 2
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "Test User 1, Test User 4 read Test book A recommended by Test User 2.",
						:timestamp => "4 days ago",
						:category_id => 3
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "Test User 4 wrote a review on Test-BookA.",
						:timestamp => "2 days ago",
						:category_id => 4
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "Test User 1 bookmarked test book for later viewing.",
						:timestamp => "2 days ago",
						:category_id => 5
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "Test User 1 from Facebook joined Reader's Door.",
						:timestamp => "2 days ago",
						:category_id => 6
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "Test User 1 from Facebook joined Reader's Door.",
						:timestamp => "2 days ago",
						:category_id => 7
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "Test User 1 started following you.",
						:timestamp => "2 days ago",
						:category_id => 8
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "Test User 1, Test User 2 tagged as Tag.",
						:timestamp => "2 days ago",
						:category_id => 9
					},
					{
						:thumb => "assets/profile_pic.jpeg",
						:message => "Test User 1, Test User 2 started following TestUser4.",
						:timestamp => "2 days ago",
						:category_id => 10
					}
				]
				render :json => {:notifications => notifications}, :status => 200
			end

            private
            def neo_init
                @neo = Neography::Rest.new
            end

		end
	end
end