include UsersGraphHelper
module Api
	module V0
		class UserApi

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
						if user[0][0]["data"]["password"] == params[:password] && user[0][0]["data"]["verified"]
							authenticate = true
							session[:user_id] = user[0][1]
							# request.session[:email] = email
							info = {:profile_status => 0, :user_id => user[0][1]}
							message = "Logged in successfully."
						elsif  user[0][0]["data"]["password"] != params[:password]
							message = "Email and password doesn't match."
						elsif ! user[0][0]["data"]["verified"]
							message = "Please verify your email address."
						else
							message = "Email and password doesn't match."
						end
					rescue => err
						message = "Email not registered."
					end
				else
					verification_token = SecureRandom.hex
					link = Rails.application.config.home+'verify?p='+verification_token.to_s+"&e="+email
					invitation = {:email => email, :template => 'email_verification', :link => link}
					if user.present?
						if user[0][0]["data"]["verified"]
							message = "Email already registered. Please check your inbox to reset password if you have forgotten."
						else
							clause = "MATCH (user:User{email:\""+email+"\"}) SET user.verification_token = \""+verification_token+"\""
							@neo.execute_query clause
							SubscriptionMailer.verify_email(invitation).deliver
							message = "Please activate your email account. We are sending you another mail."
						end
					else
						#FIXME: create new user in the graph
						UsersGraphHelper.create_user(email, params[:password], verification_token)
						SubscriptionMailer.invite(invitation).deliver
						message = "We have sent you an email with an activation link. Please activate your account."
					end
				end
				info = info.merge(:message => message, :authenticate => authenticate)
				info
			end

			def self.get_most_connected_friends
				#FIXME Get most connected friends from the graph
				friends = [
					{
						:id => 1,
						:name => "Test User",
						:thumb => "assets/profile_pic.jpeg"
					},
					{
						:id => 2,
						:name => "Test User",
						:thumb => "assets/profile_pic.jpeg"
					},
					{
						:id => 3,
						:name => "Test User",
						:thumb => "assets/profile_pic.jpeg"
					},
					{
						:id => 4,
						:name => "Test User",
						:thumb => "assets/profile_pic.jpeg"
					},
					{
						:id => 5,
						:name => "Test User",
						:thumb => "assets/profile_pic.jpeg"
					},
					{
						:id => 6,
						:name => "Test User",
						:thumb => "assets/profile_pic.jpeg"
					},
					{
						:id => 7,
						:name => "Test User",
						:thumb => "assets/profile_pic.jpeg"
					},
					{
						:id => 8,
						:name => "Test User",
						:thumb => "assets/profile_pic.jpeg"
					},
					{
						:id => 9,
						:name => "Test User",
						:thumb => "assets/profile_pic.jpeg"
					},
					{
						:id => 10,
						:name => "Test User",
						:thumb => "assets/profile_pic.jpeg"
					}
				]
				
				info = {"friends" => friends}
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