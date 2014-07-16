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
                labels = WebsiteApi.get_labels session[:user_id]
                render :json => labels, :status => 200
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
				news_feed = WebsiteApi.get_news_feed session[:user_id]
				render :json => {:notifications => news_feed}, :status => 200
			end

            private
            def neo_init
                @neo = Neography::Rest.new
            end

		end
	end
end