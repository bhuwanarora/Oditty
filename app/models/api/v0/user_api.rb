include UsersGraphHelper
module Api
	module V0
		class UserApi

			def self.recommend_book(user_id, friend_ids, book_id)
				for friend_id in friend_ids
					UsersGraphHelper.recommend_book(user_id, friend_id, book_id)
				end
			end

			def self.comment_on_book(user_id, params)
				icon = params[:message][:label2][:icon].present? ? params[:message][:label2][:icon] : params[:message][:label1][:icon] rescue ""
				label1 = params[:message][:label1][:name] rescue ""
				label2 = params[:message][:label2][:name] rescue ""
				message = params[:message][:message] rescue ""
				tweet = {
					:icon => icon, 
					:label1 => label1, 
					:label2 => label2, 
					:message => message
				}
				UsersGraphHelper.comment_on_book(user_id, params[:id], tweet)
			end

			def self.save_info(user_id, params)
				@neo = Neography::Rest.new
				
				clause = " SET u.name = \""+params[:name]+"\"" 	if params[:name]
				clause = " SET u.latitude="+params[:latitude].to_s+", u.longitude="+params[:longitude].to_s if params[:latitude]
				clause = " SET u.init_book_read_count=\""+params[:init_book_read_count]+"\"" if params[:init_book_read_count]
				clause = " SET u.gender=\""+params[:gender]+"\"" if params[:gender]
				clause = " SET u.selectedYear="+params[:selectedYear].to_s+", u.selectedMonth=\""+params[:selectedMonth].to_s+"\", u.selectedDay="+params[:selectedDay].to_s if params[:selectedDay]
				clause = " SET u.profile=\""+params[:profile]+"\"" if params[:profile]
				clause = " SET u.profile_picture="+params[:profile_picture] if params[:profile_picture]
				clause = " SET u.thumb_blob=\""+params[:blob]+"\"" if params[:blob]
				clause = " WITH u MATCH (g:Category) WHERE ID(g)="+params[:genre].to_s+" CREATE UNIQUE (u)-[:Likes]->(g)" if params[:genre] && params[:status]
				clause = " WITH u MATCH (u)-[r:Likes]->(g:Category) WHERE ID(g)="+params[:genre].to_s+" DELETE r" if params[:genre] && !params[:status]
				clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+clause
				puts clause.blue.on_red
				@neo.execute_query clause
			end

			def self.get_details user_id
				@neo = Neography::Rest.new
				clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+" RETURN u"
				puts clause.blue.on_red
				info = @neo.execute_query(clause)["data"][0][0]["data"]
				info
			end

			def self.handle_facebook_user params
				@neo = Neography::Rest.new	
				set_clause = " SET fu.first_name = \""+params[:first_name].to_s+"\", fu.last_name = \""+params[:last_name].to_s+"\", fu.link = \""+params[:link].to_s+"\", fu.locale = \""+params[:locale].to_s+"\", fu.name = \""+params[:name].to_s+"\", fu.timezone = \""+params[:timezone].to_s+"\", fu.updated_time = \""+params[:updated_time].to_s+"\", fu.verified = "+params[:verified].to_s+", fu.profile_status = "+params[:profile_status].to_s+", fu.thumb = \""+params[:thumb].to_s+"\", fu.logged = "+params[:logged].to_s
				return_clause = " RETURN ID(user)"
				if params[:email]
					clause = "MATCH (user:User{email:\""+email+"\"}) RETURN ID(user)"
					puts clause.blue.on_red
					user_id = @neo.execute_query clause
					user_exists = user_id["data"].present?
					if user_exists
						clause = "START user=node:node_auto_index('indexed_email:"+params[:email]+"') MERGE (user)-[:FacebookAuth]->(fu:FacebookUser) SET user.thumb = CASE WHEN user.thumb IS NULL THEN \""+params[:thumb].to_s+"\" ELSE user.thumb END SET user.name = CASE WHEN user.name IS NULL THEN \""+params[:name].to_s+"\" ELSE user.name END SET user.fb_id = "+params[:id].to_s+set_clause+return_clause
					else
						clause = "CREATE (user:User{fb_id:"+params[:id]+" email:\""+params[:email]+"\", indexed_email: \""+params[:email]+"\", thumb:\""+params[:thumb].to_s+"\", like_count:0, rating_count:0, timer_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0, name:\""+params[:name].to_s+"\"}), (user)-[:FacebookAuth]->(fu:FacebookUser), (user)-[fn:FeedNext{user_id:ID(user)}]->(user), (user)-[:Ego{user_id:ID(user)}]->(user) WITH user, fu MATCH(bm:Label{basic:true}) CREATE (user)-[:Labelled{user_id:ID(user)}]->(bm)"+set_clause+return_clause

					end
				else
					clause = "MATCH (user:User{fb_id:"+params[:id]+"}) RETURN ID(user)"
					puts clause.blue.on_red
					user_id = @neo.execute_query clause
						user_exists = user_id["data"].present?
					if user_exists
						clause = "MERGE (user:User{fb_id:"+params[:id]+"}) MERGE (user)-[:FacebookAuth]->(fu:FacebookUser) SET user.thumb = CASE WHEN user.thumb IS NULL THEN \""+params[:thumb].to_s+"\" ELSE user.thumb END SET user.name = CASE WHEN user.name IS NULL THEN \""+params[:name].to_s+"\" ELSE user.name END "+set_clause+return_clause
					else
						clause = "CREATE (user:User{fb_id:"+params[:id]+", like_count:0, rating_count:0, timer_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0, name:\""+params[:name].to_s+"\"}), (user)-[:FacebookAuth]->(fu:FacebookUser), (user)-[fn:FeedNext{user_id:ID(user)}]->(user), (user)-[:Ego{user_id:ID(user)}]->(user) WITH user, fu MATCH(bm:Label{basic:true}) CREATE (user)-[:Labelled{user_id:ID(user)}]->(bm) SET user.thumb=\""+params[:thumb].to_s+"\" "+set_clause+return_clause
					end
				end
				puts clause.blue.on_red
				user_id = @neo.execute_query clause
				user_id["data"][0][0]
			end

			def self.authenticate(session, params)
				authenticate = false
				info = {}
				signin = params[:old_user]
				email = params[:email]
				@neo = Neography::Rest.new
				clause = "MATCH (user:User{email:\""+email+"\"}) RETURN user, ID(user) as id"
				puts clause.blue.on_red
				user = @neo.execute_query(clause)["data"]
				if signin
					begin
						active_user_authenticated = user[0][0]["data"]["password"] == params[:password] && user[0][0]["data"]["verified"] && user[0][0]["data"]["active"] == true
						user_authenticated = user[0][0]["data"]["password"] == params[:password] && user[0][0]["data"]["verified"]
						if active_user_authenticated
							authenticate = true
							session[:user_id] = user[0][1]
							info = {:profile_status => 0, :user_id => user[0][1]}
							message = Constants::LoginSuccess
						elsif user_authenticated
							message = Constants::PendingActivation
						elsif  user[0][0]["data"]["password"] != params[:password]
							message = Constants::AuthenticationFailed
						elsif !user[0][0]["data"]["verified"]
							message = Constants::VerifyEmail
						else
							message = Constants::AuthenticationFailed
						end
					rescue => err
						message = Constants::EmailNotRegistered
					end
				else
					verification_token = SecureRandom.hex
					link = Rails.application.config.home+'verify?p='+verification_token.to_s+"&e="+email
					invitation = {:email => email, :template => 'email_verification', :link => link}
					if user.present?
						if user[0][0]["data"]["verified"]
							message = Constants::EmailAlreadyRegistered
						else
							clause = "MATCH (user:User{email:\""+email+"\"}) SET user.verification_token = \""+verification_token+"\""
							@neo.execute_query clause
							SubscriptionMailer.verify_email(invitation).deliver
							message = Constants::AnotherActivationRequest
						end
					else
						#FIXME: create new user in the graph
						UsersGraphHelper.create_user(email, params[:password], verification_token)
						SubscriptionMailer.invite(invitation).deliver
						message = Constants::ActivateAccount
					end
				end
				info = info.merge(:message => message, :authenticate => authenticate)
				info
			end

			def self.get_most_connected_friends user_id
				@neo = Neography::Rest.new
				clause = "MATCH (u:User)-[:Follow]->(friend:User) WHERE ID(u)="+user_id.to_s+" RETURN ID(friend), friend.name, friend.thumb"
				friends = @neo.execute_query(clause)["data"]
				friends
			end

			def self.get_info_card_data
				reading_count_list = [
					{"name"=> "0-10 Books"},
					{"name"=> "10-30 Books"},
					{"name"=> "30-50 Books"},
					{"name"=> "50-100 Books"},
					{"name"=> "100+ Books"}
				]

				info = {"reading_count_list" => reading_count_list}

			end

		end
	end
end