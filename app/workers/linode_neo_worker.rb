class LinodeNeoWorker
	include ShelfariCrawler
	@queue = :linode_neo
	def self.perform(clause)
		response = Net::HTTP.post_form(URI.parse("http://www.readersdoor.com/data"), {:q => clause})
		puts response.green
	end
end