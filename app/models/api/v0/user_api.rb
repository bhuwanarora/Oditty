module Api
	module V0
		class UserApi

			def self.authenticate session, params
				User::Authenticate.new(session, params).action
			end

			def self.set_intro_seen_status user_id, status
				User.new(user_id).set_intro_seen_status(status)
			end

			def self.get_details(user_id, session)
				info = {}
				if user_id.present?
					info = User.new(user_id).get_basic_info.execute[0]
					# session[:last_book] = info["last_book"]
				end
				info
			end

			def self.news_visited(user_id, id)
				Bookmark::Type::Visited.new(user_id, id).news.add.execute
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
				info = User.new(user_id).get_followers(skip_count).execute
			end

			def self.get_users_followed(user_id, skip_count)
				info = User.new(user_id).get_users_followed(skip_count).execute
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
				Book.new(book_id).get_lenders user_id											
			end

			def self.get_profile_info_of_another id, user_id
				User.new(user_id).get_profile_info_and_follow_status(id).execute
			end

			def self.set_region user_id, region
				User.new(user_id).set_region(region)
			end
		end
	end
end