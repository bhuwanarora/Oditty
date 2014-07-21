class FiltersUsers < ActiveRecord::Base
	attr_accessible :user_id, :filter_id, :priority
end
