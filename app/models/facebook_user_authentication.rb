class FacebookUserAuthentication < ActiveRecord::Base
	attr_accessible	:link, :first_name, :last_name, :gender, :uid, :locale, :location_id, 
					:location_name, :username, :oauth_token, :user_id, :image_url, :access_token
	belongs_to :user
end
