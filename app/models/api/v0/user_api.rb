module Api
	module V0
		class UserApi

			def self.authenticate params
				authenticate = false
				info = {}
				if params[:old_user]
					verified_user = params[:email] == "test@gmail.com"
					unregistered_user = params[:email] == "unregistered@gmail.com"
					unverified_user = params[:email] == "unverified@gmail.com"

					if verified_user
						authenticate = true
						info = {:profile_status => 0, :user_id => 1}
						message = "Logged in successfully."
					elsif unregistered_user
						message = "Email and password doesn't match."
					elsif unverified_user
						message = "Please verify your email address."
					else
						message = "Email and password doesn't match."
					end
				else
					email_already_registered = params[:email] == "alreadyregistered@gmail.com"

					if email_already_registered
						message = "Email already registered. Please check your inbox to reset password if you have forgotten."
					else
						message = "We have sent you an email with an activation link. Please activate your account."
					end
				end
				info = info.merge(:message => message, :authenticate => authenticate)
				info
			end

			def self.get_most_connected_friends
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