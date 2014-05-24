module Api
	module V0
		class UserApi

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