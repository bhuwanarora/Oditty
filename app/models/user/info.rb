class User::Info < User
	
	def self.set_last_login email
		 " SET user.last_login = \"" + Time.now.strftime("%Y-%m-%d") + "\" "
	end


	def self.set_email email
		" SET user.email = \""+email+"\" "
	end

	def self.set_thumb thumb
		" SET user.thumb = \""+thumb+"\" "
	end

	def self.set_name name
		" SET user.name = \""+name+"\", user.indexed_user_name=\""+name.downcase.gsub(" ","")+"\", user.search_index=\""+name.downcase.gsub(" ","")+"\""
	end

	def self.set_first_name first_name
		" SET user.first_name=\""+first_name+"\" "
	end

	def self.set_last_name last_name
		" SET user.last_name=\""+last_name+"\" "
	end

	def self.set_location latitude, longitude
		" SET user.latitude="+latitude.to_s+", user.longitude="+longitude.to_s
	end

	def self.set_init_book_read_count init_book_read_count
		" SET user.init_book_read_count=\""+init_book_read_count+"\"" if init_book_read_count
	end

	def self.set_gender gender
		" SET user.gender=\""+gender+"\" "
	end

	def self.set_date_of_birth selected_year, selected_month, selected_day
		" SET user.selectedYear="+selected_year.to_s+", user.selectedMonth=\""+selected_month.to_s+"\", user.selectedDay="+selected_day.to_s+" "
	end

	def self.set_profile type
		" SET user.profile=\""+profile+"\" "
	end

	def self.set_profile_picture profile_picture
		" SET user.profile_picture="+profile_picture+" "
	end

	def self.set_about about
		" SET user.about=\""+about+"\" "
	end

	def self.add_category category_id
		(User.match_category category_id) + " SET likes.weight = CASE WHEN likes.weight IS NULL THEN " + Constant::InteractionPoint::CategoryLike.to_s + " ELSE toInt(likes.weight) + "+Constant::InteractionPoint::CategoryLike.to_s+" END "
	end

	def self.remove_category category_id
		(User.match_category category_id) + " SET likes.weight = CASE WHEN likes.weight IS NULL THEN 0 ELSE toInt(likes.weight) - "+Constant::InteractionPoint::CategoryLike.to_s+" END "
	end

	def self.set_verification_token email, verification_token
		" MATCH (user:User{email:\""+email+"\"}) SET user.verification_token = \""+verification_token+"\" "
	end
end