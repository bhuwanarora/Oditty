include UsersGraphHelper
module Api
	module V0
		class UserApi

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
						if  user[0][0]["data"]["password"] == params[:password] &&  user[0][0]["data"]["verified"]
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