class User::Authenticate::FacebookAuthentication < User::Authenticate
	def initialize(params)
		puts params.to_s
		@params = params[:users_api]
	end

	def handle
		puts @params.to_s.red
		if @params["email"]
			puts "email exists".green
			user = User::Info.get_by_email(@params["email"]).execute[0]
			user_exists = user.present?
			user_id = user_exists ? user["id"] : User.merge_by_email(@params["email"]).execute[0]["id"] 
		else
			puts "email does not exits".green
			user = User::Info.get_by_fb_id(@params["id"]).execute[0]
			user_exists = user.present?
			user_id = user_exists ? user["id"] : User.merge_by_fb_id(@params["id"]).execute[0]["id"] 
		end
		Resque.enqueue(FacebookDataEntryWorker, user_exists, @params)
		puts user_id.to_s
		user_id
	end

	def self.update_user_without_email 
		User::FacebookUser.new(@params["id"]).merge + User::FacebookUser.set_thumb(@params["thumb"]) + User::FacebookUser.set_name(@params["name"]) + User::FacebookUser.set_last_login + User::Authenticate::FacebookAuthentication._fb_set_clause 
	end

	def self.create_user_without_email 
		User::FacebookUser.new(@params).create + User::Feed.create_first + Label.match_primary + User.link_primary_labels + User::FacebookUser.create_facebook_user + User.set_thumb + User::FacebookUser.set_last_login + User::Authenticate::FacebookAuthentication._fb_set_clause 
	end

	def self.update_user_with_email 
		User::Authenticate::FacebookAuthentication.update_user_without_email + User::Info.set_email(@params["email"])
	end

	def self._create_user_with_email
		User::Authenticate::FacebookAuthentication.create_user_without_email + User::Info.set_email(@params["email"])
	end

	private

	def self._fb_set_clause 
		set_clause = ""
		property_clause = ""
		for key in @params.keys
			puts "_fb_set_clause #{@params[key].class} #{key}".blue
			if @params[key].class == Array
				new_string = self._get_string_from_array(key, @params[key])
				property_clause = property_clause + new_string
			elsif (@params[key].class == ActiveSupport::HashWithIndifferentAccess) || (@params[key].class == ActionController::Parameters)
				puts "TO ADD #{@params[key].class}".red
			else
				set_clause = set_clause + " SET fu."+key.to_s+"=\""+@params[key].to_s.gsub("\"","'")+"\""
			end
		end
		set_clause = set_clause + property_clause
		set_clause
	end

	def self._get_string_from_array(key, array)
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
				connector = object_string.present? ? "," : ""

				if param[object_key].class == String
					object_string = object_string + connector + new_string + self._handle_string(object_key, param[object_key])

				elsif param[object_key].class == Array
					for hash_object in param[object_key]
						node_string = node_string + self._handle_hash(hash_object, object_key, new_label)	
					end

				elsif (param[object_key].class == Hash) || (param[object_key].class == ActiveSupport::HashWithIndifferentAccess)
					node_string = node_string + self._handle_hash(param[object_key], object_key, new_label)
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

	def self._handle_string(key, value)
		key.to_s+": \""+value.to_s.gsub("\"", "'")+"\""
	end

	def self._handle_hash(param, object_key, new_label)
		new_object_string = ""
		for new_object_key in param.keys
			connector = new_object_string.present? ? "," : ""  
			new_string = self._handle_string(new_object_key, param[new_object_key])
			new_object_string = new_object_string + connector + new_string
		end

		new_object_string = " CREATE UNIQUE ("+new_label.to_s+")-[:HasProperty]->(:"+object_key.to_s.singularize.camelcase+"{"+new_object_string+"})"
		new_object_string
	end
end 