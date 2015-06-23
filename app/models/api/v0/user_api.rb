module Api
	module V0
		class UserApi
			
			def self.get_facebook_books user_id
				User.new(user_id).get_facebook_books.execute[0]
			end

			def self.set_intro_seen_status user_id, status
				User.new(user_id).set_intro_seen_status(status)
			end

			def self.get_bookmarks(id, user_id, type)
				User.new(user_id).get_bookmarks(id, type)
			end

			def self.get_details(user_id)
				info = {}
				if user_id.present?
					info = User.new(user_id).get_basic_info.execute[0]
				end
				info
			end

			def self.get_relative_details(friend_id, user_id)
				info = {}
				if friend_id.present?
					info = UsersUser.new(friend_id, user_id).get_basic_info.execute[0]
				end
				info
			end

			def self.news_visited(user_id, id)
				visited = Bookmark::Type::Visited.new(user_id, id)
				clause = ""
				if user_id.present?
					clause = "WITH news" + visited.news.add
				end
				clause = visited.set_news_view_count + clause
				clause.execute
			end

			def self.follow_user user_id, friend_id
				UsersUser.new(user_id, friend_id).follow
			end

			def self.follow_community user_id, community_id, status
				if status == "true"
					UsersCommunity.new(user_id, community_id).follow
				else
					UsersCommunity.new(user_id, community_id).unfollow
				end
			end

			def self.add_book_searched user_id, id
				UsersBook.new(id, user_id).handle_searched
			end
			
			def self.add_bookmark user_id, id, type, shelf
				puts user_id
				puts id
				puts type
				puts shelf
				clause =""
				if type == "BOOK"
					case shelf
					when "HAVELEFTAMARKONME"
						clause = Bookmark::Type::HaveLeftAMarkOnMe.new(user_id, id).book.add
					when "VISITED"
						clause = Bookmark::Type::Visited.new(user_id, id).book.add
					when "IOWNTHIS"
						clause = Bookmark::Type::IOwnThis.new(user_id, id).book.add
					when "NOTWORTHREADING"
						clause = Bookmark::Type::NotWorthReading.new(user_id, id).book.add
					when "CURRENTLYREADING"
						clause = Bookmark::Type::CurrentlyReading.new(user_id, id).book.add
					when "WISHIHADNTREAD"
						clause = Bookmark::Type::WishIHadntRead.new(user_id, id).book.add
					when "READBUTCANTREMEMBERASINGLETHINGABOUTIT"
						clause = Bookmark::Type::ReadButCantRememberASingleThingAboutIt.new(user_id, id).book.add
					when "PRETENDIHAVEREAD"
						clause = Bookmark::Type::PretendIHaveRead.new(user_id, id).book.add
					when "INTENDINGTOREAD"
						clause = Bookmark::Type::IntendingToRead.new(user_id, id).book.add
					when "READ"
						clause = Bookmark::Type::Read.new(user_id, id).book.add
					when "DIDNTFEELLIKEREADINGITAFTERAPOINT"
						clause = Bookmark::Type::DidntFeelLikeReadingItAfterAPoint.new(user_id, id).book.add
					when "SAVINGFORWHENIHAVEMORETIME"
						clause = Bookmark::Type::SavingForWhenIHaveMoreTime.new(user_id, id).book.add
					when "WILLNEVERREAD"
						clause = Bookmark::Type::WillNeverRead.new(user_id, id).book.add
					when "PURELYFORSHOW"
						clause = Bookmark::Type::PurelyForShow.new(user_id, id).book.add
					when "PLANTOBUY"
						clause = Bookmark::Type::PlanToBuy.new(user_id, id).book.add
					end
				elsif type == "COMMUNITY"
					case shelf
					when "HAVELEFTAMARKONME"
						clause = Bookmark::Type::HaveLeftAMarkOnMe.new(user_id, id).news.add
					when "VISITED"
						clause = Bookmark::Type::Visited.new(user_id, id).news.add
					when "IOWNTHIS"
						clause = Bookmark::Type::IOwnThis.new(user_id, id).news.add
					when "NOTWORTHREADING"
						clause = Bookmark::Type::NotWorthReading.new(user_id, id).news.add
					when "CURRENTLYREADING"
						clause = Bookmark::Type::CurrentlyReading.new(user_id, id).news.add
					when "WISHIHADNTREAD"
						clause = Bookmark::Type::WishIHadntRead.new(user_id, id).news.add
					when "READBUTCANTREMEMBERASINGLETHINGABOUTIT"
						clause = Bookmark::Type::ReadButCantRememberASingleThingAboutIt.new(user_id, id).news.add
					when "PRETENDIHAVEREAD"
						clause = Bookmark::Type::PretendIHaveRead.new(user_id, id).news.add
					when "INTENDINGTOREAD"
						clause = Bookmark::Type::IntendingToRead.new(user_id, id).news.add
					when "READ"
						clause = Bookmark::Type::Read.new(user_id, id).news.add
					when "DIDNTFEELLIKEREADINGITAFTERAPOINT"
						clause = Bookmark::Type::DidntFeelLikeReadingItAfterAPoint.new(user_id, id).news.add
					when "SAVINGFORWHENIHAVEMORETIME"
						clause = Bookmark::Type::SavingForWhenIHaveMoreTime.new(user_id, id).news.add
					when "WILLNEVERREAD"
						clause = Bookmark::Type::WillNeverRead.new(user_id, id).news.add
					when "PURELYFORSHOW"
						clause = Bookmark::Type::PurelyForShow.new(user_id, id).news.add
					when "PLANTOBUY"
						clause = Bookmark::Type::PlanToBuy.new(user_id, id).news.add
					end

				elsif type == "BLOG"
					case shelf
					when "HAVELEFTAMARKONME"
						clause = Bookmark::Type::HaveLeftAMarkOnMe.new(user_id, id).blog.add
					when "VISITED"
						clause = Bookmark::Type::Visited.new(user_id, id).blog.add
					when "IOWNTHIS"
						clause = Bookmark::Type::IOwnThis.new(user_id, id).blog.add
					when "NOTWORTHREADING"
						clause = Bookmark::Type::NotWorthReading.new(user_id, id).blog.add
					when "CURRENTLYREADING"
						clause = Bookmark::Type::CurrentlyReading.new(user_id, id).blog.add
					when "WISHIHADNTREAD"
						clause = Bookmark::Type::WishIHadntRead.new(user_id, id).blog.add
					when "READBUTCANTREMEMBERASINGLETHINGABOUTIT"
						clause = Bookmark::Type::ReadButCantRememberASingleThingAboutIt.new(user_id, id).blog.add
					when "PRETENDIHAVEREAD"
						clause = Bookmark::Type::PretendIHaveRead.new(user_id, id).blog.add
					when "INTENDINGTOREAD"
						clause = Bookmark::Type::IntendingToRead.new(user_id, id).blog.add
					when "READ"
						clause = Bookmark::Type::Read.new(user_id, id).blog.add
					when "DIDNTFEELLIKEREADINGITAFTERAPOINT"
						clause = Bookmark::Type::DidntFeelLikeReadingItAfterAPoint.new(user_id, id).blog.add
					when "SAVINGFORWHENIHAVEMORETIME"
						clause = Bookmark::Type::SavingForWhenIHaveMoreTime.new(user_id, id).blog.add
					when "WILLNEVERREAD"
						clause = Bookmark::Type::WillNeverRead.new(user_id, id).blog.add
					when "PURELYFORSHOW"
						clause = Bookmark::Type::PurelyForShow.new(user_id, id).blog.add
					when "PLANTOBUY"
						clause = Bookmark::Type::PlanToBuy.new(user_id, id).blog.add
					end

				elsif type == "LISTOPIA"
				elsif type == ""
				end
				clause
			end

			def self.get_feed user_id, skip_count=0
				News.get_feed(skip_count)
			end

			def self.remove_bookmark user_id, id, type, shelf
				puts user_id
				puts id
				puts type
				puts shelf
				clause =""
				if type == "BOOK"
					case shelf
					when "HAVELEFTAMARKONME"
						clause = Bookmark::Type::HaveLeftAMarkOnMe.new(user_id, id).book.remove
					when "VISITED"
						clause = Bookmark::Type::Visited.new(user_id, id).book.remove
					when "IOWNTHIS"
						clause = Bookmark::Type::IOwnThis.new(user_id, id).book.remove
					when "NOTWORTHREADING"
						clause = Bookmark::Type::NotWorthReading.new(user_id, id).book.remove
					when "CURRENTLYREADING"
						clause = Bookmark::Type::CurrentlyReading.new(user_id, id).book.remove
					when "WISHIHADNTREAD"
						clause = Bookmark::Type::WishIHadntRead.new(user_id, id).book.remove
					when "READBUTCANTREMEMBERASINGLETHINGABOUTIT"
						clause = Bookmark::Type::ReadButCantRememberASingleThingAboutIt.new(user_id, id).book.remove
					when "PRETENDIHAVEREAD"
						clause = Bookmark::Type::PretendIHaveRead.new(user_id, id).book.remove
					when "INTENDINGTOREAD"
						clause = Bookmark::Type::IntendingToRead.new(user_id, id).book.remove
					when "READ"
						clause = Bookmark::Type::Read.new(user_id, id).book.remove
					when "DIDNTFEELLIKEREADINGITAFTERAPOINT"
						clause = Bookmark::Type::DidntFeelLikeReadingItAfterAPoint.new(user_id, id).book.remove
					when "SAVINGFORWHENIHAVEMORETIME"
						clause = Bookmark::Type::SavingForWhenIHaveMoreTime.new(user_id, id).book.remove
					when "WILLNEVERREAD"
						clause = Bookmark::Type::WillNeverRead.new(user_id, id).book.remove
					when "PURELYFORSHOW"
						clause = Bookmark::Type::PurelyForShow.new(user_id, id).book.remove
					when "PLANTOBUY"
						clause = Bookmark::Type::PlanToBuy.new(user_id, id).book.remove
					end
				elsif type == "COMMUNITY"
					case shelf
					when "HAVELEFTAMARKONME"
						clause = Bookmark::Type::HaveLeftAMarkOnMe.new(user_id, id).news.remove
					when "VISITED"
						clause = Bookmark::Type::Visited.new(user_id, id).news.remove
					when "IOWNTHIS"
						clause = Bookmark::Type::IOwnThis.new(user_id, id).news.remove
					when "NOTWORTHREADING"
						clause = Bookmark::Type::NotWorthReading.new(user_id, id).news.remove
					when "CURRENTLYREADING"
						clause = Bookmark::Type::CurrentlyReading.new(user_id, id).news.remove
					when "WISHIHADNTREAD"
						clause = Bookmark::Type::WishIHadntRead.new(user_id, id).news.remove
					when "READBUTCANTREMEMBERASINGLETHINGABOUTIT"
						clause = Bookmark::Type::ReadButCantRememberASingleThingAboutIt.new(user_id, id).news.remove
					when "PRETENDIHAVEREAD"
						clause = Bookmark::Type::PretendIHaveRead.new(user_id, id).news.remove
					when "INTENDINGTOREAD"
						clause = Bookmark::Type::IntendingToRead.new(user_id, id).news.remove
					when "READ"
						clause = Bookmark::Type::Read.new(user_id, id).news.remove
					when "DIDNTFEELLIKEREADINGITAFTERAPOINT"
						clause = Bookmark::Type::DidntFeelLikeReadingItAfterAPoint.new(user_id, id).news.remove
					when "SAVINGFORWHENIHAVEMORETIME"
						clause = Bookmark::Type::SavingForWhenIHaveMoreTime.new(user_id, id).news.remove
					when "WILLNEVERREAD"
						clause = Bookmark::Type::WillNeverRead.new(user_id, id).news.remove
					when "PURELYFORSHOW"
						clause = Bookmark::Type::PurelyForShow.new(user_id, id).news.remove
					when "PLANTOBUY"
						clause = Bookmark::Type::PlanToBuy.new(user_id, id).news.remove
					end

				elsif type == "BLOG"
					case shelf
					when "HAVELEFTAMARKONME"
						clause = Bookmark::Type::HaveLeftAMarkOnMe.new(user_id, id).blog.add
					when "VISITED"
						clause = Bookmark::Type::Visited.new(user_id, id).blog.add
					when "IOWNTHIS"
						clause = Bookmark::Type::IOwnThis.new(user_id, id).blog.add
					when "NOTWORTHREADING"
						clause = Bookmark::Type::NotWorthReading.new(user_id, id).blog.add
					when "CURRENTLYREADING"
						clause = Bookmark::Type::CurrentlyReading.new(user_id, id).blog.add
					when "WISHIHADNTREAD"
						clause = Bookmark::Type::WishIHadntRead.new(user_id, id).blog.add
					when "READBUTCANTREMEMBERASINGLETHINGABOUTIT"
						clause = Bookmark::Type::ReadButCantRememberASingleThingAboutIt.new(user_id, id).blog.add
					when "PRETENDIHAVEREAD"
						clause = Bookmark::Type::PretendIHaveRead.new(user_id, id).blog.add
					when "INTENDINGTOREAD"
						clause = Bookmark::Type::IntendingToRead.new(user_id, id).blog.add
					when "READ"
						clause = Bookmark::Type::Read.new(user_id, id).blog.add
					when "DIDNTFEELLIKEREADINGITAFTERAPOINT"
						clause = Bookmark::Type::DidntFeelLikeReadingItAfterAPoint.new(user_id, id).blog.add
					when "SAVINGFORWHENIHAVEMORETIME"
						clause = Bookmark::Type::SavingForWhenIHaveMoreTime.new(user_id, id).blog.add
					when "WILLNEVERREAD"
						clause = Bookmark::Type::WillNeverRead.new(user_id, id).blog.add
					when "PURELYFORSHOW"
						clause = Bookmark::Type::PurelyForShow.new(user_id, id).blog.add
					when "PLANTOBUY"
						clause = Bookmark::Type::PlanToBuy.new(user_id, id).blog.add
					end

				elsif type == "LISTOPIA"
				elsif type == ""
				end
				clause
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
					info = {"message" => message , "user_exists" => user_exists, "user_id" => user["id"]}
				else
					message = Constant::StatusMessage::EmailNotRegistered
					info = {"message" => message , "user_exists" => user_exists}
				end
				info
			end

			def self.get_profile_info id
				User.new(id).get_detailed_info.execute
			end

			def self.add_books_from_fb(params, user_id)
				if params[:data].present?
					FacebookBooksWorker.perform_async(params, user_id)
				end
			end

			def self.recommend_book(user_id, friends_id, book_id)
				@neo = Neography::Rest.new
				clause = UsersUser.new(user_id,friends_id).recommend_book(book_id)				
				clause.execute
				clause = "MATCH (book:Book), (user:User), (friend:User) WHERE ID(user)=" + user_id.to_s + " AND ID(book)=" + book_id.to_s + " AND ID(friend)=" + friends_id.to_s + User.return_group("book.title AS title, ID(book) as book_id, book.author_name AS author_name, book.isbn AS isbn", "user.image_url AS image_url, ID(user) as id, user.first_name AS first_name, user.last_name AS last_name", "friend.first_name as friends_first_name, friend.last_name AS friends_last_name, ID(friend) AS friends_id, friend.email AS friends_email")
				info = clause.execute[0]
				isbn = info["isbn"].split(",")[0] rescue ""
				params = {
					:template => Constant::EmailTemplate::RecommendBooks, 
				  	:user => {
				  		:image_url => info["image_url"], 
				  		:id => info["id"],
				  		:name => info["first_name"] + " " + info["last_name"],
				  	},
				  	:friend =>{
				  		:name => info["friends_first_name"],
				  		:email => info["friends_email"],
				  		:id => info["friends_id"]
				  	},
				  	:book => {
				  		:id => info["book_id"],
				  		:title => info["title"],
				  		:author_name => info["author_name"],
				  		:isbn => isbn
				  	}
				}
				if params[:friend][:email]
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
							clause = User::Info.set_email params[:email]
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

					clause = User::Info.add_category params[:category_id]					 		if params[:category_id] && params[:status]
					clause = User::Info.remove_category params[:category_id]						if params[:category_id] && !params[:status]

					if clause
						clause = User.new(user_id).match + clause
						clause.execute
					else
						duplicate_email
					end
				end
			end

			def self.handle_facebook_user(params)
				User::Authenticate::FacebookAuthentication.new(params).handle
			end

			def self.authenticate(params)
				info = User::Authenticate.new(params).action
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

			def self.get_followers(user_id, skip_count)
				User.new(user_id).get_followers(skip_count)
			end

			def self.get_users_followed(user_id, skip_count)
				User.new(user_id).get_users_followed(skip_count)
			end

			def self.handle_google_user params
				@neo = Neography::Rest.new
				# clause = "MATCH ()"
				debugger
				# @neo.execute_query clause
			end

			def self.get_notifications user_id
				info = User.new(user_id).get_notifications.execute
				notifications = []
				for data_info in info
					if data_info["label"][0] == "User"
					elsif data_info["label"][0] == "RecommendNode"
						notification = {
							:friend_id => data_info["notification"]["data"]["friend_id"],
							:book_id => data_info["notification"]["data"]["book_id"],
							:user_id => data_info["notification"]["data"]["user_id"],
							:timestamp => data_info["notification"]["data"]["timestamp"]
						}
						data_info["notification"] = notification
						notifications.push data_info
					end
				end
				notifications
			end

			def self.verify(params)
				user = User::Authenticate.new(params).verify.execute[0]
			    if user.present?
			      	message = Constant::StatusMessage::EmailConfirmed
			    else
			    	message = Constant::StatusMessage::VerificationTokenExpired
			    end
			    puts message
		    	message
			end


			def self.get_lenders book_id, user_id
				UsersBook.new(user_id, book_id).notify_borrow + Book.new(book_id).get_lenders(user_id)
			end

			def self.get_profile_info_of_another id, user_id
				User.new(user_id).get_profile_info_and_follow_status(id).execute
			end

			def self.set_region user_id, region, ip
				region = GeoIP.new('GeoIP.dat').country(remote_ip.to_s).country_name  
				User.new(user_id).set_region(region)
			end

			def self.search_friends(user_id, search_text)
				info = User.new(user_id).search_friends(search_text).execute
				info
			end
		end
	end
end