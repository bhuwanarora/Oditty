module Api
	module V0
		class UserApi

			def self.get_details(user_id, session)
				if user_id.present?
					@neo = Neography::Rest.new
					clause = "MATCH (u:User) WHERE ID(u)=" + user_id.to_s + " RETURN" + self._user_return_clause
					begin
						info = @neo.execute_query(clause)[0]
						session[:last_book] = info["last_book"]
					rescue Exception => e
						info = {}
					end
				else
					info = {}
				end
				info
			end

			def self.recover_password email
				@neo = Neography::Rest.new
				clause = "MATCH (user:User{email:\""+email+"\"}) RETURN" + self._user_return_clause
				user_id = @neo.execute_query clause
				user_exists = user_id.present?
				if user_exists
					verification_token = SecureRandom.hex
					link = Rails.application.config.home+'recover_password?p='+verification_token.to_s+"&e="+email
					invitation = {:email => email, :template => Constants::EmailTemplate::PasswordReset, :link => link}
					SubscriptionMailer.recover_password(invitation).deliver
					clause =  "MATCH (user:User{email:\""+email+"\"}) SET user.password_token = \""+verification_token+"\""
					@neo.execute_query clause
				end
				user_exists
			end

			def self.get_profile_info id
				@neo = Neography::Rest.new
				clause = "MATCH (u:User) WHERE ID(u)="+id.to_s+" OPTIONAL MATCH (u)-[:Likes]->(c) WITH u, c OPTIONAL MATCH (u)-[:Labelled]->(l:Label{indexed_label_name:\""+Constants::InfluentialBooks+"\"})-[:BookmarkedOn]->(z:BookmarkNode)-[:BookmarkAction]->(b:Book) WHERE z.user_id = "+id.to_s+" RETURN COLLECT(DISTINCT(c.name)), COLLECT(DISTINCT(ID(c))), COLLECT(DISTINCT(c.icon)), COLLECT(DISTINCT(b.isbn)), COLLECT(DISTINCT(ID(b))), COLLECT(DISTINCT(b.title)), COLLECT(DISTINCT(b.author_name))"
				info = @neo.execute_query(clause)["data"][0]
			end

			def self.add_books_from_fb(params, user_id)
				puts "#{params[:type].to_s.green}"
				if params[:data].present?
					for book in params[:data]
						title = book[:name].gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "").gsub("\\", "").downcase rescue ""
						if title
							id = SearchApi.search(title, 1, 'BOOK')
							puts id.to_s.green
						end
					end
				end
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
					clause = " SET u.thumb = \""+params[:data][:url]+"\"" if params[:data] && params[:data][:url]
					clause = " SET u.name = \""+params[:name]+"\", u.indexed_user_name=\""+params[:name].downcase.gsub(" ","")+"\", u.search_index=\""+params[:name].downcase.gsub(" ","")+"\"" 	if params[:name]
					clause = " SET u.first_name=\""+params[:first_name]+"\"" if params[:first_name]
					clause = " SET u.last_name=\""+params[:last_name]+"\"" if params[:last_name]
					clause = " SET u.latitude="+params[:latitude].to_s+", u.longitude="+params[:longitude].to_s if params[:latitude]
					clause = " SET u.init_book_read_count=\""+params[:init_book_read_count]+"\"" if params[:init_book_read_count]
					clause = " SET u.gender=\""+params[:gender]+"\"" if params[:gender]
					clause = " SET u.selectedYear="+params[:selectedYear].to_s+", u.selectedMonth=\""+params[:selectedMonth].to_s+"\", u.selectedDay="+params[:selectedDay].to_s if params[:selectedDay]
					clause = " SET u.profile=\""+params[:profile]+"\"" if params[:profile]
					clause = " SET u.profile_picture="+params[:profile_picture] if params[:profile_picture]
					clause = " SET u.ask_info = "+params[:ask_info].to_s if params[:ask_info] == false
					clause = " SET u.thumb_blob=\""+params[:blob]+"\"" if params[:blob]
					clause = " SET u.about=\""+params[:about]+"\"" if params[:about]

					clause = " WITH u MATCH (g:Category) WHERE ID(g)="+params[:genre].to_s+" CREATE UNIQUE (u)-[:Likes]->(g)" if params[:genre] && params[:status]
					clause = " WITH u MATCH (u)-[r:Likes]->(g:Category) WHERE ID(g)="+params[:genre].to_s+" DELETE r" if params[:genre] && !params[:status]
					if clause
						clause = "MATCH (u:User) WHERE ID(u)="+user_id.to_s+clause
						@neo.execute_query clause
					else
						duplicate_email
					end
				end
			end

			def self.handle_facebook_user(params, session)
				@neo = Neography::Rest.new	
				params = params[:users_api]
				puts params.to_s.red
				
				if params[:email]
					puts "email exists".green
					clause = "MATCH (user:User{email:\""+params[:email]+"\"}) RETURN ID(user)"
					user_id = @neo.execute_query clause
					user_exists = user_id["data"].present?
					if user_exists
						clause = self._update_user_with_email params
					else
						clause = self._create_user_with_email params
					end
				else
					puts "email does not exits".green
					clause = "MATCH (user:User{fb_id:"+params[:id]+"}) RETURN ID(user)"
					user_id = @neo.execute_query clause
					user_exists = user_id["data"].present?
					if user_exists
						clause = self._update_user_without_email params
					else
						clause = self._create_user_without_email params
					end
				end
				user_id = @neo.execute_query(clause)["data"][0][0]
				puts "fb execute_query done...".green
				puts "FB LOGIN USER_ID #{user_id.to_s.red}"
				session[:user_id] = user_id
				puts "session #{session[:user_id]}".red
				user_id
			end

			def self.authenticate(session, params)
				authenticate = false
				info = {}
				signin = params[:old_user]
				email = params[:email]
				@neo = Neography::Rest.new
				clause = "MATCH (user:User{email:\""+email+"\"}) RETURN user, ID(user) as id"
				user = @neo.execute_query(clause)["data"]
				if signin
					puts "signin".red
					begin
						active_user_authenticated = (user[0][0]["data"]["password"] == params[:password]) && user[0][0]["data"]["verified"] && (user[0][0]["data"]["active"] == true)
						user_authenticated = user[0][0]["data"]["password"] == params[:password] && user[0][0]["data"]["verified"]
						if active_user_authenticated
							authenticate = true
							session[:user_id] = user[0][1]
							info = {:profile_status => 0, :user_id => user[0][1]}
							clause = "MATCH (user:User{email:\""+email+"\"}) SET user.last_login = \""+Time.now.strftime("%Y-%m-%d")+"\""
							@neo.execute_query clause
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
						UsersGraphHelper.create_user(email, params[:password], verification_token)
						SubscriptionMailer.verify_email(invitation).deliver
						message = Constants::ActivateAccount
					end
				end
				info = info.merge(:message => message, :authenticate => authenticate)
				puts "SESSION USER ID "+session[:user_id].to_s.blue.on_red
				info
			end

			def self.get_most_connected_friends(user_id, count, skip)
				friends = []
				if user_id.present?
					@neo = Neography::Rest.new
					limit_clause = " LIMIT "+count.to_s
					skip_clause = " SKIP "+skip.to_s
					clause = "MATCH (u:User)-[:Follow]->(friend:User) WHERE ID(u)="+user_id.to_s+" OPTIONAL MATCH (friend)-[:Likes]->(category:Category) RETURN ID(friend), friend.name, friend.thumb, friend.init_book_read_count, friend.total_count, friend.book_read_count, friend.bookmark_count, COLLECT(category.icon)"+skip_clause+limit_clause
					friends = @neo.execute_query(clause)["data"]
				end
				friends
			end

			def self.get_followed_by user_id
				@neo = Neography::Rest.new
				clause = "MATCH (u:User)<-[:Follow]-(friend:User) WHERE ID(u)="+user_id.to_s+" RETURN ID(friend), friend.name, friend.thumb"
				friends = @neo.execute_query(clause)["data"]
				friends
			end

			def self.get_info_card_data
				reading_count_list = [
					{"name"=> "0-20"},
					{"name"=> "20-50"},
					{"name"=> "50-100"},
					{"name"=> "100-250"},
					{"name"=> "250+"}
				]

				info = {"reading_count_list" => reading_count_list}
			end

			def self.handle_google_user params
				@neo = Neography::Rest.new
				# clause = "MATCH ()"
				debugger
				# @neo.execute_query clause
			end

			def self.get_notifications user_id
				info = UsersGraphHelper.get_notifications user_id
				info
			end

			private
			def self._fb_set_clause params
				set_clause = ""
				property_clause = ""
				for key in params.keys
					puts "_fb_set_clause #{params[key].class} #{key}".blue
					if params[key].class == Array
						new_string = self._get_string_from_array(key, params[key])
						property_clause = property_clause + new_string
					elsif (params[key].class == ActiveSupport::HashWithIndifferentAccess) || (params[key].class == ActionController::Parameters)
						puts "TO ADD #{params[key].class}".red
					else
						set_clause = set_clause + " SET fu."+key.to_s+"=\""+params[key].to_s.gsub("\"","'")+"\""
					end
				end

				set_clause = set_clause + property_clause
				set_clause
			end

			def self._fb_return_clause
				" RETURN DISTINCT(ID(user))"
			end

			def self._update_user_with_email params
				merge_clause = "MERGE (user:User{fb_id:"+params[:id]+"}) MERGE (user)-[:FacebookAuth]->(fu:FacebookUser) "
				set_thumb = "SET user.thumb = CASE WHEN user.thumb IS NULL THEN \""+params[:thumb].to_s+"\" ELSE user.thumb END "
				set_name = "SET user.name = CASE WHEN user.name IS NULL THEN \""+params[:name].to_s+"\" ELSE user.name END "
				set_last_login = "SET user.last_login = \""+Time.now.strftime("%Y-%m-%d")+"\" "
				set_email = "SET user.email = \""+params[:email].to_s+"\""
				clause = merge_clause + set_thumb + set_name + set_last_login + set_email + self._fb_set_clause(params) + self._fb_return_clause
				clause
			end

			def self._create_user_with_email params
				create_clause = "CREATE (user:User{fb_id:"+params[:id]+", email:\""+params[:email]+"\", thumb:\""+params[:thumb].to_s+"\", like_count:0, rating_count:0, timer_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0, name:\""+params[:name].to_s+"\", last_book: "+Constants::BestBook.to_s+", amateur: true, ask_info: true}), (user)-[:FacebookAuth]->(fu:FacebookUser), (user)-[fn:FeedNext{user_id:ID(user)}]->(user), (user)-[:Ego{user_id:ID(user)}]->(user) WITH user, fu "
				label_clause = "MATCH(bm:Label{primary_label:true}) CREATE (user)-[:Labelled{user_id:ID(user)}]->(bm) WITH DISTINCT(user) as user, fu "
				follow_clause = "MATCH (all_user:User) WHERE all_user <> user CREATE (user)-[:Follow]->(all_user), (user)<-[:Follow]-(all_user) WITH user, fu "
				set_clause = "SET user.last_login = \""+Time.now.strftime("%Y-%m-%d")+"\" "
				clause = create_clause + label_clause + follow_clause + set_clause + self._fb_set_clause(params)+self._fb_return_clause
				clause
			end

			def self._update_user_without_email params
				merge_clause = "MERGE (user:User{fb_id:"+params[:id]+"}) MERGE (user)-[:FacebookAuth]->(fu:FacebookUser) "
				set_thumb = "SET user.thumb = CASE WHEN user.thumb IS NULL THEN \""+params[:thumb].to_s+"\" ELSE user.thumb END "
				set_name = "SET user.name = CASE WHEN user.name IS NULL THEN \""+params[:name].to_s+"\" ELSE user.name END "
				set_last_login = "SET user.last_login = \""+Time.now.strftime("%Y-%m-%d")+"\" "
				clause = merge_clause + set_thumb + set_name + set_last_login + self._fb_set_clause(params) + self._fb_return_clause
				clause
			end

			def self._create_user_without_email params
				create_clause = "CREATE (user:User{fb_id:"+params[:id]+", like_count:0, rating_count:0, timer_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0, name:\""+params[:name].to_s+"\", last_book:"+Constants::BestBook.to_s+", amateur: true, ask_info: true}), (user)-[:FacebookAuth]->(fu:FacebookUser), (user)-[fn:FeedNext{user_id:ID(user)}]->(user), (user)-[:Ego{user_id:ID(user)}]->(user) WITH user, fu "
				label_clause = "MATCH(bm:Label{primary_label:true}) CREATE (user)-[:Labelled{user_id:ID(user)}]->(bm) SET user.thumb=\""+params[:thumb].to_s+"\" WITH DISTINCT(user) as user, fu "
				follow_clause = "MATCH (all_user:User) WHERE all_user <> user CREATE (user)-[:Follow]->(all_user), (user)<-[:Follow]-(all_user) WITH user, fu "
				set_clause = "SET user.last_login = \""+Time.now.strftime("%Y-%m-%d")+"\" "
				clause = create_clause + label_clause + follow_clause + set_clause + self._fb_set_clause(params)+self._fb_return_clause
				clause
			end

			def self._get_string_from_array(key, array)
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
							new_string = self._handle_string(object_key, param[object_key])
							object_string = object_string + connector + new_string
						elsif param[object_key].class == Array
							for hash_object in param[object_key]
								node_string = node_string + self._handle_hash(hash_object, object_key, new_label)		
							end
						elsif (param[object_key].class == Hash) || (param[object_key].class == ActiveSupport::HashWithIndifferentAccess)
							node_string = node_string + self._handle_hash(param[object_key], object_key, new_label)
						end

						puts "#{param[object_key].to_s.green} #{object_key.to_s} #{key} #{param[object_key].class}"
						puts object_string.to_s.blue
						puts node_string.to_s.red
					end
					if object_string.present?
						string = string + " CREATE UNIQUE (user)-[:"+label+"]->("+new_label+":"+label.singularize+"{"+object_string+"}) "+node_string
					end
				end
				string
			end

			def self._handle_string(key, value)
				key.to_s+": \""+value.to_s.gsub("\"", "'")+"\""
			end

			def self._handle_hash(param, object_key, new_label)
				new_object_string = ""
				for new_object_key in param.keys
					if new_object_string.present?
						connector = ","
					else
						connector = ""
					end
					new_string = self._handle_string(new_object_key, param[new_object_key])
					new_object_string = new_object_string + connector + new_string
				end
				new_object_string = " CREATE UNIQUE ("+new_label.to_s+")-[:HasProperty]->(:"+object_key.to_s.singularize.camelcase+"{"+new_object_string+"})"
				new_object_string
			end

			def self._user_return_clause
				clause = " u.init_book_read_count AS init_book_read_count, u.selectedYear AS selectedYear, u.selectedMonth AS selectedMonth, u.selectedDay AS selectedDay, u.first_name AS first_name, u.last_name AS last_name, u.about AS about, ID(u) AS id"
				clause
			end
		end
	end
end