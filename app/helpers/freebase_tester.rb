module FreebaseTester

	def self.search_resource(q, filter={})
		FreebaseAPI.session.search(q, filter)
	end

	def self.fetch_resource id
		FreebaseAPI::Topic.get id
	end

	def self.search q
		FreebaseAPI::Topic.search q
	end

	def self.mqlread(id, type="/internet/website"	)
		FreebaseAPI.session.mqlread({
		  :type => type,
		  :id => id,
		  :'/common/topic/official_website' => nil}
		)
	end

	def self.image id
		FreebaseAPI.session.image(id, maxwidth: 150, maxheight: 150)
	end
end