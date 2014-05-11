class Filter < ActiveRecord::Base
	attr_accessible :name, :priority, :filter_type
end
