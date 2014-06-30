class ThumbRequest < ActiveRecord::Base
	attr_accessible :thumb_url, :title, :book_url, :username, :user_thumb, :user_link, :status
end