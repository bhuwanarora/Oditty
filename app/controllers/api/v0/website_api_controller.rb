module Api
	module V0
		class WebsiteApiController < ApplicationController
			def s3
				begin
					info = S3WebsiteHelper.s3_access_token
					render :json => info, :status => 200
				rescue Exception => e
					render :json => e.to_s, :status => 500
				end
			end

			def genres
                @neo ||= neo_init
				filter = params[:q]
                genres = WebsiteApi.get_root_categories(session[:user_id])
                
				render :json => genres, :status => 200
			end

			def test
				puts "TEST ".green
				puts params[:website_api].to_s.red
				render :json => {:message => "Success"}, :status => 200
			end

			def fb_books
				# UserApi.add_books_from_fb(params, session[:user_id])
				render :json => {:message => "Success"}, :status => 200
			end

			def fb_books_map
				begin
					@neo = Neography::Rest.new
					clause = "MATCH (b:Book) WHERE b.url=~'.*"+params[:id].to_s+".*' RETURN ID(b), b.title, b.author_name, b.isbn"
					puts clause.blue.on_red
					info = @neo.execute_query(clause)["data"]
					render :json => info, :status => 200
				rescue Exception => e
					render :json => {:message => e.to_s}, :status => 500
				end
			end
			
			def book_lists
				@neo = Neography::Rest.new
				clause = "MATCH (bg:BookGrid)-[:RelatedBooks]->(b:Book) WHERE bg.status=1 RETURN ID(bg), bg.name, COUNT(b), COLLECT(b.isbn)"
				puts clause.blue.on_red
				info = @neo.execute_query(clause)["data"]
				render :json => info, :status => 200
			end

			def trends
				neo = Neography::Rest.new
				skip_count = params[:skip].present? ? params[:skip].to_i+1 : 0
    			clause = "MATCH (t:Trending)-[:RelatedBooks]->(b:Book) WHERE t.status = 1 RETURN t.name, ID(t), t.content, t.url, t.title, t.thumb, t.thumbnail_url, t.publisher_thumb, t.searched_words, t.timestamp, COLLECT (b.isbn) ORDER BY t.timestamp DESC SKIP "+skip_count.to_s+" LIMIT 8"
    			puts clause.blue.on_red
    			trends = neo.execute_query(clause)["data"]
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
                results = {:times => time_groups.reverse!}
                render :json => results, :status => 200
            end

            def read_times
                @neo ||= neo_init
                clause = "MATCH (r:ReadTime) RETURN r"
                puts clause.blue.on_red
                read_times = @neo.execute_query(clause)["data"]
                results = {:read_times => read_times}
                render :json => results, :status => 200
            end

			def notifications
				news_feed = []
				if params[:id] && ((params[:debug] == "false") || !params[:debug])
					news_feed = WebsiteApi.get_personal_feed(params[:id], params[:skip_count].to_i+1)
				elsif params[:debug].present? && params[:debug] == "true"
					news_feed = WebsiteApi.get_news_feed(params[:id], params[:skip_count].to_i+1)
				else
					news_feed = WebsiteApi.get_news_feed(session[:user_id], params[:skip_count].to_i+1)
				end
				render :json => {:notifications => news_feed}, :status => 200
			end

			def latest_notification
				news_feed = WebsiteApi.get_latest_notification session[:user_id]
				render :json => {:notifications => news_feed}, :status => 200
			end

			def save_feedback
				WebsiteApi.save_feedback(params[:feedback], session[:user_id])
				render :json => {:message => "Success"}, :status => 200
			end

            private
            def neo_init
                @neo = Neography::Rest.new
            end

		end
	end
end