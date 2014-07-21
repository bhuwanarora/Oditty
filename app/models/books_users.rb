class BooksUsers < ActiveRecord::Base
	require 'uniquify'
	uniquify :uuid, :salt, :length => 12, :chars => 0..9
	
	attr_accessible :book_id, :user_id, :reading_status_id, :relation_type_id, :given_on, :borrowed_on, 
					:registered_on, :review
	belongs_to :reading_status
	belongs_to :relation_type
	belongs_to :book
	belongs_to :user
end
