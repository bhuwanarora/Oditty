class GoogleUserAuthentication < ActiveRecord::Base
	attr_accessible :user_id, :oauth_token, :image_url, :first_name, :last_name, :username, :link
	belongs_to :user
end