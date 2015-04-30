class User::Info < User
	
	def self.set_last_login 
		 " SET user.last_login = \"" + Time.now.strftime("%Y-%m-%d") + "\" "
	end

	def self.set_verification_time time = Time.now.to_i.to_s
		" SET user.verification_time = " + time + " "
	end


	def self.set_email email
		" SET user.email = \""+email+"\" "
	end

	def self.set_verified_true 
		" FOREACH (ignore IN CASE WHEN user.verification_time > " + (Time.now.to_i - Constant::Count::VerificationExpirySeconds).to_s + " THEN [1] ELSE [] END | SET user.verified = true " + User::Info.set_verification_token("null") + User::Info.set_verification_time("null") + " )  "
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

	def self.set_verification_token verification_token
		if verification_token == "null"
			clause = " SET user.verification_token = " + verification_token.to_s + " "
		else
			clause = " SET user.verification_token = \"" + verification_token.to_s + "\" "
		end
		clause
	end
end