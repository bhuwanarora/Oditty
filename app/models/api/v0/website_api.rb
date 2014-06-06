module Api
	module V0
		class WebsiteApi
			def self.get_labels
				neo_init
				labels = @neo.execute_query("MATCH (l:Label) RETURN l")["data"]
				output_labels = []
				for label in labels do
					output_labels.push label[0]["data"]
				end
				output_labels
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