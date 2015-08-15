class User::Authenticate::FacebookAuthentication < User::Authenticate
	def initialize(params)
		puts params.to_s
		@params = params
	end

	def handle
		puts @params.to_s.red
		if @params["email"]
			puts "email exists".green
			user = User::Info.get_by_email(@params["email"]).execute[0]
			user_exists = (user.present? && user["id"].present?)? true : false
			user = User.merge_by_email(@params["email"]).execute[0] unless user_exists
		else
			puts "email does not exits".green
			user = User::Info.get_by_fb_id(@params["id"]).execute[0]
			user_exists = (user.present? && user["id"].present?)? true : false
			user = User.merge_by_fb_id(@params["id"]).execute[0] unless user_exists
		end
		user_id = user["id"]
		FacebookDataEntryWorker.perform_async(user_exists, @params, user_id)
		if @params["thumb"].present? && user_id.present?
			type = "user"
			VersionerWorker.perform_async(user_id, @params["thumb"], type)
		end
		puts user_id.to_s
		user
	end

	def update_user_without_email user_id
		User.new(user_id).match + User::Info.set_last_login + " WITH user " + User::FacebookUser.create_facebook_user + ( @params["thumb"].present? ? User::Info.set_thumb(@params["thumb"]) : " " ) + User::FacebookUser.set_name(@params["name"]) + fb_set_clause 
	end

	def create_user_without_email user_id
		User.new(user_id).match + User::Info.set_last_login + " WITH user " + User::FacebookUser.new(@params).add_info + UserNotification.create_for_new_user + Category::Root.match + ", user " + User.link_root_categories + User::Feed.create_first + Label.match_basic + ", user " + User.link_basic_labels + User::FacebookUser.create_facebook_user + ( @params["thumb"].present? ? User::Info.set_thumb(@params["thumb"]) : " " ) + User::FacebookUser.set_name(@params["name"]) + fb_set_clause
	end

	def update_user_with_email user_id 
		update_user_without_email(user_id) + User::Info.set_email(@params["email"])
	end

	def create_user_with_email user_id
		create_user_without_email(user_id) + User::Info.set_email(@params["email"])
	end

	def fb_set_clause 
		set_clause = ""
		property_clause = ""
		for key in @params.keys
			puts "fb_set_clause #{@params[key].class} #{key}".blue
			if @params[key].class == Array
				new_string = User::Authenticate::FacebookAuthentication.get_string_from_array(key, @params[key])
				property_clause = property_clause + new_string
			elsif (@params[key].class == ActiveSupport::HashWithIndifferentAccess) || (@params[key].class == ActionController::Parameters)
				puts "TO ADD #{@params[key].class}".red
			else
				set_clause = set_clause + " SET facebook_user."+key.to_s+"=\""+@params[key].to_s.gsub("\"","'")+"\""
			end
		end
		set_clause = set_clause + property_clause
		set_clause
	end

	def self.get_string_from_array(key, array)
		key = key.to_s
		string = ""
		label = key.camelcase
		count = 0
		for param in array
			count = count + 1
			
			object_string = ""
			node_string = ""
			new_label = label.downcase+count.to_s
			for object_key in param.keys
				if object_string.present?
					connector = ","
				else
					connector = ""
				end
				if param[object_key].class == String
					new_string = User::Authenticate::FacebookAuthentication.handle_string(object_key, param[object_key])
					object_string = object_string + connector + new_string
				elsif param[object_key].class == Array
					for hash_object in param[object_key]
						node_string = node_string + User::Authenticate::FacebookAuthentication.handle_hash(hash_object, object_key, new_label)		
					end
				elsif (param[object_key].class == Hash) || (param[object_key].class == ActiveSupport::HashWithIndifferentAccess)
					node_string = node_string + User::Authenticate::FacebookAuthentication.handle_hash(param[object_key], object_key, new_label)
				end

				puts "#{param[object_key].to_s.green} #{object_key.to_s} #{key} #{param[object_key].class}"
				puts object_string.to_s.blue
				puts node_string.to_s.red
			end
			if object_string.present?
				string = string + " CREATE UNIQUE (user)-[:"+label+"]->("+new_label+":"+label.singularize+"{"+object_string+"}) "+node_string
			end
		end
		string
	end

	def self.handle_string(key, value)
		key.to_s+": \""+value.to_s.gsub("\"", "'")+"\""
	end

	def self.handle_hash(param, object_key, new_label)
		new_object_string = ""
		for new_object_key in param.keys
			if new_object_string.present?
				connector = ","
			else
				connector = ""
			end
			new_string = User::Authenticate::FacebookAuthentication.handle_string(new_object_key, param[new_object_key])
			new_object_string = new_object_string + connector + new_string
		end
		new_object_string = " CREATE UNIQUE ("+new_label.to_s+")-[:HasProperty]->(:"+object_key.to_s.singularize.camelcase+"{"+new_object_string+"})"
		new_object_string
	end
end 