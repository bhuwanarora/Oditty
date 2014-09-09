include UsersGraphHelper
module Api
	module V0
		class UserApi

			def self.recover_password email
				@neo = Neography::Rest.new
				clause = "MATCH (user:User{email:\""+email+"\"}) RETURN user, ID(user) as id"
				puts clause.blue.on_red
				user_id = @neo.execute_query clause
				user_exists = user_id["data"].present?
				if user_exists
					verification_token = SecureRandom.hex
					link = Rails.application.config.home+'recover_password?p='+verification_token.to_s+"&e="+email
					invitation = {:email => email, :template => Constants::EmailTemplate::PasswordReset, :link => link}
					SubscriptionMailer.recover_password(invitation).deliver
					clause =  "MATCH (user:User{email:\""+email+"\"}) SET user.password_token = \""+verification_token+"\""
					puts clause.blue.on_red
					@neo.execute_query clause
				end
				user_exists
			end

			def self.recommend_book(user_id, friend_ids, book_id)
				@neo = Neography::Rest.new
				for friend_id in friend_ids
					UsersGraphHelper.recommend_book(user_id, friend_id, book_id)
					clause = "MATCH (b:Book), (u:User), (f:User) WHERE ID(b)="+book_id.to_s+" AND ID(u)="+user_id.to_s+" AND ID(f)="+friend_id.to_s+" RETURN b, u, f"
					data = @neo.execute_query(clause)["data"][0]
					book = data[0]["data"]
					user = data[1]["data"]
					friend = data[2]["data"]
					isbn = book["isbn"].split(",")[0] rescue ""
					params = {
								:template => Constants::EmailTemplate::RecommendBooks, 
							  	:user => {
							  		:thumb => user["thumb"], 
							  		:id => user_id,
							  		:name => user["name"]
							  	},
							  	:friend =>{
							  		:name => friend["name"],
							  		:email => friend["email"]
							  	},
							  	:book => {
							  		:id => book_id,
							  		:title => book["title"],
							  		:author_name => book["author_name"],
							  		:isbn => isbn
							  	}
							}
					SubscriptionMailer.recommend_book(params).deliver
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
				if user_id.present?
					@neo = Neography::Rest.new
					if params[:email]
						user_clause = "MATCH (u:User) WHERE u.email=\""+params[:email]+"\" RETURN ID(u)"
						id = @neo.execute_query(user_clause)["data"]
						if id.present?
							if user_id != id
								duplicate_email = true
							end
						else
							clause = " SET u.email = \""+params[:email]+"\""
						end
					end
					clause = " SET u.name = \""+params[:name]+"\", u.indexed_user_name=\""+params[:name].downcase.gsub(" ","")+"\"" 	if params[:name]
					clause = " SET u.latitude="+params[:latitude].to_s+", u.longitude="+params[:longitude].to_s if params[:latitude]
					clause = " SET u.init_book_read_count=\""+params[:init_book_read_count]+"\"" if params[:init_book_read_count]
					clause = " SET u.gender=\""+params[:gender]+"\"" if params[:gender]
					clause = " SET u.selectedYear="+params[:selectedYear].to_s+", u.selectedMonth=\""+params[:selectedMonth].to_s+"\", u.selectedDay="+params[:selectedDay].to_s if params[:selectedDay]
					clause = " SET u.profile=\""+params[:profile]+"\"" if params[:profile]
					clause = " SET u.profile_picture="+params[:profile_picture] if params[:profile_picture]
					clause = " SET u.thumb_blob=\""+params[:blob]+"\"" if params[:blob]
					clause = " WITH u MATCH (g:Category) WHERE ID(g)="+params[:genre].to_s+" CREATE UNIQUE (u)-[:Likes]->(g)" if params[:genre] && params[:status]
					clause = " WITH u MATCH (u)-[r:Likes]->(g:Category) WHERE ID(g)="+params[:genre].to_s+" DELETE r" if params[:genre] && !params[:status]

					if clause
						clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+clause
						puts clause.blue.on_red
						@neo.execute_query clause
					else
						duplicate_email
					end
				end
			end

			def self.get_details user_id
				if user_id.present?
					@neo = Neography::Rest.new
					clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+" RETURN u"
					puts clause.blue.on_red
					begin
						info = @neo.execute_query(clause)["data"][0][0]["data"]
					rescue Exception => e
						info = {}
					end
				else
					info = {}
				end
				info
			end

			def self.handle_facebook_user params
				@neo = Neography::Rest.new	
				params = params[:users_api]
				puts params.to_s.red
				set_clause = ""
				property_clause = ""
				for key in params.keys
					if params[key].class == Array
						new_string = self.get_string_from_array(key, params[key])
						property_clause = property_clause + new_string
					else
						set_clause = set_clause + " SET fu."+key.to_s+"=\""+params[key].to_s+"\""
					end
				end

				set_clause = set_clause + property_clause
				
				return_clause = " RETURN DISTINCT(ID(user))"
				if params[:email]
					puts "email exits".green
					clause = "MATCH (user:User{email:\""+email+"\"}) RETURN ID(user)"
					puts clause.blue.on_red
					user_id = @neo.execute_query clause
					user_exists = user_id["data"].present?
					if user_exists
						clause = "START user=node:node_auto_index('email:"+params[:email]+"') MERGE (user)-[:FacebookAuth]->(fu:FacebookUser) SET user.thumb = CASE WHEN user.thumb IS NULL THEN \""+params[:thumb].to_s+"\" ELSE user.thumb END SET user.name = CASE WHEN user.name IS NULL THEN \""+params[:name].to_s+"\" ELSE user.name END SET user.fb_id = "+params[:id].to_s+set_clause+return_clause
					else
						clause = "CREATE (user:User{fb_id:"+params[:id]+" email:\""+params[:email]+"\", thumb:\""+params[:thumb].to_s+"\", like_count:0, rating_count:0, timer_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0, name:\""+params[:name].to_s+"\"}), (user)-[:FacebookAuth]->(fu:FacebookUser), (user)-[fn:FeedNext{user_id:ID(user)}]->(user), (user)-[:Ego{user_id:ID(user)}]->(user) WITH user, fu MATCH(bm:Label{primary_label:true}) CREATE (user)-[:Labelled{user_id:ID(user)}]->(bm) WITH DISTINCT(user) as user, fu MATCH (all_user:User) WHERE all_user <> user CREATE (user)-[:Follow]->(all_user), (user)<-[:Follow]-(all_user) WITH user, fu "+set_clause+return_clause

					end
				else
					puts "email does not exits".green
					clause = "MATCH (user:User{fb_id:"+params[:id]+"}) RETURN ID(user)"
					puts clause.blue.on_red
					user_id = @neo.execute_query clause
						user_exists = user_id["data"].present?
					if user_exists
						clause = "MERGE (user:User{fb_id:"+params[:id]+"}) MERGE (user)-[:FacebookAuth]->(fu:FacebookUser) SET user.thumb = CASE WHEN user.thumb IS NULL THEN \""+params[:thumb].to_s+"\" ELSE user.thumb END SET user.name = CASE WHEN user.name IS NULL THEN \""+params[:name].to_s+"\" ELSE user.name END "+set_clause+return_clause
					else
						clause = "CREATE (user:User{fb_id:"+params[:id]+", like_count:0, rating_count:0, timer_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0, name:\""+params[:name].to_s+"\"}), (user)-[:FacebookAuth]->(fu:FacebookUser), (user)-[fn:FeedNext{user_id:ID(user)}]->(user), (user)-[:Ego{user_id:ID(user)}]->(user) WITH user, fu MATCH(bm:Label{primary_label:true}) CREATE (user)-[:Labelled{user_id:ID(user)}]->(bm) SET user.thumb=\""+params[:thumb].to_s+"\" WITH DISTINCT(user) as user, fu MATCH (all_user:User) WHERE all_user <> user CREATE (user)-[:Follow]->(all_user), (user)<-[:Follow]-(all_user) WITH user, fu "+set_clause+return_clause
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
					puts "signin".red
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
					invitation = {:email => email, :template => Constants::EmailTemplate::EmailVerification, :link => link}
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
						SubscriptionMailer.verify_email(invitation).deliver
						message = Constants::ActivateAccount
					end
				end
				info = info.merge(:message => message, :authenticate => authenticate)
				info
			end

			def self.get_most_connected_friends user_id
				friends = []
				if user_id.present?
					@neo = Neography::Rest.new
					clause = "MATCH (u:User)-[:Follow]->(friend:User) WHERE ID(u)="+user_id.to_s+" OPTIONAL MATCH (friend)-[:Likes]->(category:Category) RETURN ID(friend), friend.name, friend.thumb, friend.init_book_read_count, friend.total_count, friend.book_read_count, friend.bookmark_count, COLLECT(category.name)"
					puts clause.blue.on_red
					friends = @neo.execute_query(clause)["data"]
				end
				friends
			end

			def self.get_followed_by user_id
				@neo = Neography::Rest.new
				clause = "MATCH (u:User)<-[:Follow]-(friend:User) WHERE ID(u)="+user_id.to_s+" RETURN ID(friend), friend.name, friend.thumb"
				puts clause.blue.on_red
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

			def self.handle_google_user params
				@neo = Neography::Rest.new
				# clause = "MATCH ()"
				debugger
				# @neo.execute_query clause
			end

			private
			def self.get_string_from_array(key, array)
				key = key.to_s
				string = ""
				label = key.camelcase
				count = 0
				for param in array
					count = count + 1
					
					object_string = ""
					node_string = ""
					new_label = label.downcase+count.to_s
					for object_key in param.keys
						if object_string.present?
							connector = ","
						else
							connector = ""
						end
						if param[object_key].class == String
							new_string = self.handle_string(object_key, param[object_key])
							object_string = object_string + connector + new_string
						elsif param[object_key].class == Array
							for hash_object in param[object_key]
								node_string = node_string + self.handle_hash(hash_object, object_key, new_label)		
							end
						elsif param[object_key].class == Hash
							node_string = node_string + self.handle_hash(param[object_key], object_key, new_label)
						end

						puts "#{param[object_key].to_s.green} #{object_key.to_s} #{key} #{param[object_key].class}"
						puts object_string.to_s.blue
						puts node_string.to_s.red

					end
					
					string = string + " CREATE UNIQUE (user)-[:"+label+"]->("+new_label+":"+label.singularize+"{"+object_string+"}) "+node_string
				end
				string
			end

			def self.handle_string(key, value)
				key.to_s+": \""+value.to_s+"\""
			end

			def self.handle_hash(param, object_key, new_label)
				new_object_string = ""
				for new_object_key in param.keys
					if new_object_string.present?
						connector = ","
					else
						connector = ""
					end
					new_string = self.handle_string(new_object_key, param[new_object_key])
					new_object_string = new_object_string + connector + new_string
				end
				new_object_string = " CREATE UNIQUE ("+new_label.to_s+")-[:HasProperty]->(:"+object_key.to_s.singularize.camelcase+"{"+new_object_string+"})"
				new_object_string
			end

		end
	end
end