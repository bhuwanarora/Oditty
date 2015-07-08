module Api
	module V0
		class WebsiteApiController < ApplicationController
			# require_dependency 'user/predict/category'

			def s3
				begin
					info = S3WebsiteHelper.s3_access_token
					render :json => info, :status => 200
				rescue Exception => e
					render :json => e.to_s, :status => 500
				end
			end

			def news_info
				id = params[:id]
				community_id = params[:tag_id]
				key = "NI" + id.to_s + community_id.to_s
				info = $redis.get key
				unless info
					info = Api::V0::WebsiteApi.get_important_community_info(id, community_id).execute
					$redis.set(key, info.to_json)
				else
					info = JSON.parse(info)
				end
				render :json => info, :status => 200
			end

			def basic_community_info
				id = params[:id]
				key = "BCI" + id.to_s
				info = $redis.get key
				unless info
					info = Api::V0::WebsiteApi.get_basic_community_info(id).execute
					$redis.set(key, info.to_json)
				else
					info = JSON.parse(info)
				end
				render :json => info, :status => 200
			end

			def feed_community_info
				id = params[:id]
				key = "FCI" + id.to_s
				info = $redis.get key
				unless info
					info = Api::V0::WebsiteApi.get_feed_community_info(id).execute[0]
					$redis.set(key, info.to_json)
				else
					info = JSON.parse info
				end
				render :json => info, :status => 200
			end

			def chronological_news
				id = params[:id]
				key = "CN" + id.to_s
				info = $redis.get key
				unless info
					info = Api::V0::WebsiteApi.get_chronological_news_info(id).execute
					$redis.set(key, info.to_json)
				else
					info = JSON.parse info
				end
				render :json => info, :status => 200
			end

			def add_new_label
				user_id = session[:user_id]
				info = Api::V0::WebsiteApi.add_new_label(user_id, params[:label], params[:type]).execute[0]
				render :json => info, :status => 200
			end

			def add_label
				user_id = session[:user_id]
				Api::V0::WebsiteApi.add_label(user_id, params[:label]).execute
				render :json => "Success", :status => 200
			end

			def genres
				user_id = session[:user_id]
                genres = Api::V0::WebsiteApi.get_genres(user_id)
                
				render :json => genres, :status => 200
			end

			def categories
				user_id = session[:user_id]
				genres = User::Predict::CategoryPrediction.new(user_id).get_favourites.execute
                
				render :json => genres, :status => 200
			end

			def test
				render :json => {:message => "Success"}, :status => 200
			end

			def fb_books
				user_id = session[:user_id]
				if user_id
					Api::V0::UserApi.add_books_from_fb(params, user_id)
					render :json => {:message => "Success"}, :status => 200
				else
					render :json => {:message => "Session not been set"}, :status => 200
				end
			end

			def fb_books_map
				begin
					@neo = Neography::Rest.new
					clause = "MATCH (b:Book) WHERE b.url=~'.*"+params[:id].to_s+".*' RETURN ID(b), b.title, b.author_name, b.isbn"
					info = @neo.execute_query(clause)
					render :json => info, :status => 200
				rescue Exception => e
					render :json => {:message => e.to_s}, :status => 500
				end
			end
			
			def book_lists
				@neo = Neography::Rest.new
				clause = "MATCH (bg:BookGrid)-[:RelatedBooks]->(b:Book) WHERE bg.status=1 RETURN ID(bg), bg.name, COUNT(b), COLLECT(b.isbn)"
				info = @neo.execute_query(clause)["data"]
				render :json => info, :status => 200
			end

			def trends
				neo = Neography::Rest.new
				skip_count = params[:skip].present? ? params[:skip].to_i+1 : 0
    			clause = "MATCH (t:Trending)-[:RelatedBooks]->(b:Book) WHERE t.status = 1 RETURN t.name, ID(t), t.content, t.url, t.title, t.thumb, t.thumbnail_url, t.publisher_thumb, t.searched_words, t.timestamp, COLLECT (b.isbn) ORDER BY t.timestamp DESC SKIP "+skip_count.to_s+" LIMIT 8"
    			trends = neo.execute_query(clause)
				render :json => trends, :status => 200
			end

			def countries
				filter = params[:q]
				results = {:countries => CountryGroup.all}
				render :json => results, :status => 200
			end

            def labels
            	if params[:id]
            		labels = WebsiteApi.get_labels params[:id]
            	else
                	labels = WebsiteApi.get_labels session[:user_id]
            	end
                render :json => labels, :status => 200
            end

            def times
                time_groups = WebsiteApi.get_time_groups
                render :json => time_groups.reverse!, :status => 200
            end

            def read_times
                @neo ||= neo_init
                clause = "MATCH (r:ReadTime) RETURN r.name as name, r.page_count_range as page_count_range, ID(r) as id"
                read_times = @neo.execute_query(clause)
                render :json => read_times, :status => 200
            end

			def notifications
				if params[:id].present?
					user_id = params[:id]
				else
					user_id = session[:user_id]
				end
				if user_id
					info = WebsiteApi.get_personal_feed(user_id, params[:skip].to_i)
				else
					info = []
				end
				render :json => info, :status => 200
			end

			def latest_notification
				news_feed = WebsiteApi.get_latest_notification session[:user_id]
				render :json => {:notifications => news_feed}, :status => 200
			end

			def save_feedback
				WebsiteApi.save_feedback(params[:feedback], session[:user_id])
				render :json => {:message => "Success"}, :status => 200
			end


			def get_metadata
				info = UrlParser.get_metadata params[:url]
				render :json => info, :status => 200
			end

			def get_regions
				info = Api::V0::WebsiteApi.get_regions.execute	
				render :json => info, :status => 200
			end

            private
            def neo_init
                @neo = Neography::Rest.new
            end

		end
	end
end