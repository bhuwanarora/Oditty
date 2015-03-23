module GlobalHelper
	def self.execute_query clause
		response = []
		neo = Neography::Rest.new
		puts clause.on_red
		neo_response = neo.execute_query clause
		neo_response["data"].length do |record|
			response = Hash[neo_response["columns"].zip(record)]
		end
		response
	end
end