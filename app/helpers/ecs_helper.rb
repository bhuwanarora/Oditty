module EcsHelper

	def self.item_search
		res = Amazon::Ecs.item_search('ruby', {:response_group => 'Medium', :sort => 'salesrank', :country => 'uk'})
		if res.is_valid_request?
			res.total_pages
			res.total_results
			res.item_page
		elsif res.has_error?
			puts res error
		end
	end

end