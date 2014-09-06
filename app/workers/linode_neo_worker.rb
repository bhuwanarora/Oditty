class LinodeNeoWorker
	include ShelfariCrawler
	@queue = :linode_neo
	def self.perform(clause, id)
		response = Net::HTTP.post_form(URI.parse("http://www.readersdoor.com/data"), {:q => clause, :id => id})
		puts response.green
	end
end