module Api
	module V0
		class UserApi

			def self.authenticate session, params
				User::Authenticate.new(session, params).action
			end

			def self.get_details(user_id, session)
				info = {}
				if user_id.present?
					info = User.new(user_id).get_basic_info.execute[0]
					session[:last_book] = info["last_book"]
				end
				info
			end

			def self.follow_user user_id, friend_id
				UsersUser.new(user_id, friend_id).follow
			end

			def self.add_bookmark user_id, id, type, shelf
				if type == "BOOK"
					case shelf
					when "HaveLeftAMarkOnMe"
						Bookmark::Type::HaveLeftAMarkOnMe.book.add
					when "DidntFeelLikeReadingItAfterAPoint"
						Bookmark::Type::DidntFeelLikeReadingItAfterAPoint.book.add
					when "IntendToRead"
						Bookmark::Type::IntendToRead.book.add
					when "PretendIHaveRead"
						Bookmark::Type::PretendIHaveRead.book.add
					when "Visited"
						Bookmark::Type::Visited.book.add
					end
				elsif type == "ARTICLE"
				elsif type == "LISTOPIA"
				elsif type == ""
				end
			end

			def self.get_feed user_id
				info = Article::BlogArticle.get_posts
				info
			end

			def self.remove_bookmark
				if type == "BOOK"
					case shelf
					when "HaveLeftAMarkOnMe"
						Bookmark::Type::HaveLeftAMarkOnMe.remove
					when "DidntFeelLikeReadingItAfterAPoint"
						Bookmark::Type::DidntFeelLikeReadingItAfterAPoint.remove
					when "IntendToRead"
						Bookmark::Type::IntendToRead.remove
					when "PretendIHaveRead"
						Bookmark::Type::PretendIHaveRead.remove
					end
				elsif type == "ARTICLE"
				elsif type == "LISTOPIA"
				elsif type == ""
				end
			end

			def self.unfollow_user user_id, friend_id
				UsersUser.new(user_id, friend_id).unfollow
			end

			def self.get_influential_books user_id
				Bookmark::Type::HaveLeftAMarkOnMe.get_all user_id
			end

			def self.endorse_book book_id, user_id
				UsersBook::Endorse.new(book_id, user_id).add
			end

			def self.remove_endorse book_id, user_id
				UsersBook::Endorse.new(book_id, user_id).remove
			end

			def self.rate_book book_id, user_id, rating
				UsersBook::Rate.new(book_id, user_id).add(rating)
			end

			def self.get_small_reads
				Book::SmallRead.get_sorted_books(0, 10).execute
			end

			def self.get_likeable_category user_id, favourites
				data = []
				books_processed_count = 0

				# while data.length < 10
					# data.push User::Suggest::BookSuggestion.new(user_id).for_likeable_category(favourites, books_processed_count).execute
					# books_processed_count = books_processed_count + Constant::Count::BookRecommendation*10
				# end
				data
			end

			def self.get_books_from_unexplored_subjects user_id, favourites
				User::Suggest::BookSuggestion.new(user_id).for_likeable_category(favourites).execute
			end

			def self.recover_password email
				verification_token = SecureRandom.hex
				user = User::Authenticate::Password.new(email).recover(verification_token).execute[0]
				user_exists = user.present?
				if user_exists
					link = Rails.application.config.home+'recover_password?p='+verification_token.to_s+"&e="+email
					invitation = {:email => email, :template => Constant::EmailTemplate::PasswordReset, :link => link}
					SubscriptionMailer.recover_password(invitation).deliver
					User.handle_new_verification_request(email, verification_token).execute
					message = Constant::StatusMessage::PasswordRecoveryInitiated
				else
					message = Constant::StatusMessage::EmailNotRegistered
				end
				{"message" => message , "user_exists" => user_exists, "user_id" => user["id"]}
			end

			def self.get_profile_info id
				User.new(id).get_detailed_info.execute
			end

			def self.add_books_from_fb(params, user_id)
				puts "#{params[:type].to_s.green}"
				if params[:data].present?
					for book in params[:data]
						title = book[:name].search_ready
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
								:template => Constant::EmailTemplate::RecommendBooks, 
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
					if params[:email]
						user_clause = User.get_by_email params[:email]
						user_clause.execute["id"]
						if id.present?
							if user_id != id
								duplicate_email = true
							end
						else
							clause = User.set_email params[:email]
						end
					end
					clause = User::Info.set_thumb params[:data][:url] 								if params[:data] && params[:data][:url]
					clause = User::Info.set_name params[:name] 										if params[:name]
					clause = User::Info.set_first_name params[:first_name]		 					if params[:first_name]
					clause = User::Info.set_last_name params[:last_name] 							if params[:last_name]
					clause = User::Info.set_location(params[:latitude], params[:longitude])  		if params[:latitude]
					clause = User::Info.set_init_book_read_count params[:init_book_read_count] 		if params[:init_book_read_count]
					clause = User::Info.set_gender params[:gender]									if params[:gender]
					clause = User::Info.set_date_of_birth(params[:selectedYear], params[:selectedMonth], params[:selectedDay]) if params[:selectedDay]
					clause = User::Info.set_profile params[:profile] 								if params[:profile]
					clause = User::Info.set_profile_picture params[:profile_picture] 				if params[:profile_picture]
					clause = User::Info.set_about params[:about] 									if params[:about]

					clause = User::Info.add_category params[:category_id]					 				if params[:category_id] && params[:status]
					clause = User::Info.remove_category params[:category_id]						 		if params[:category_id] && !params[:status]

					if clause
						clause = User.new(user_id).match + clause
						clause.execute
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
				info = User::Authenticate.new(session, params).action
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

			def self.get_info_card_data
				info = {"reading_count_list" => BookRange.get_values}
			end

			def self.get_followers user_id
				User.new(user_id).get_followers
			end

			def self.get_users_followed user_id
				User.new(user_id).get_users_followed
			end

			def self.handle_google_user params
				@neo = Neography::Rest.new
				# clause = "MATCH ()"
				debugger
				# @neo.execute_query clause
			end

			def self.get_notifications user_id
				info = User.new(user_id).get_notifications
				info
			end

			def self.verify(session, params)
				user = User::Authenticate.new(session, params).verify.execute[0]
			    if user.present?
			    	puts user.to_s
			    	if user["verified"]
				      	message = Constant::StatusMessage::EmailConfirmed
				    else 
				    	message = Constant::StatusMessage::VerificationTokenExpired
				    end  
			    else
				    message = Constant::StatusMessage::EmailConfirmationFailed
			    end
		    	message
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
				create_clause = "CREATE (user:User{fb_id:"+params[:id]+", email:\""+params[:email]+"\", thumb:\""+params[:thumb].to_s+"\", like_count:0, rating_count:0, timer_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0, name:\""+params[:name].to_s+"\", last_book: "+Constant::Id::BestBook.to_s+", amateur: true, ask_info: true}), (user)-[:FacebookAuth]->(fu:FacebookUser), (user)-[fn:FeedNext{user_id:ID(user)}]->(user), (user)-[:Ego{user_id:ID(user)}]->(user) WITH user, fu "
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
				create_clause = "CREATE (user:User{fb_id:"+params[:id]+", like_count:0, rating_count:0, timer_count:0, dislike_count:0, comment_count:0, bookmark_count:0, book_read_count:0, follows_count:0, followed_by_count:0, name:\""+params[:name].to_s+"\", last_book:"+Constant::Id::BestBook.to_s+", amateur: true, ask_info: true}), (user)-[:FacebookAuth]->(fu:FacebookUser), (user)-[fn:FeedNext{user_id:ID(user)}]->(user), (user)-[:Ego{user_id:ID(user)}]->(user) WITH user, fu "
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
		end
	end
end