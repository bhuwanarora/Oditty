module Api
	module V0
		class WebsiteApi
			def self.get_labels
				neo_init
				labels = UserGraphHelper.get_bookmark_labels
				labels
			end

			def self.get_time_groups
				neo_init
                time_groups = @neo.execute_query("MATCH (t:Era) RETURN t")["data"]
                time_groups
			end

			private
			def self.neo_init
				@neo = Neography::Rest.new
			end
		end
	end
end