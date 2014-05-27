class HumanProfile::Address < ActiveRecord::Base
	has_one :human_profile, :class_name => "::HumanProfile"
end
