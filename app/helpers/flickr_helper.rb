module FlickrHelper
	require 'flickraw'

	def self.get_cover_photos
		@neo = Neography::Rest.new
		photos = flickr.photos.search :tags => "reading, books, library", :privacy_filter => 1, :tag_mode => "all"
		urls = []
		count = 0
		photos.each do |photo|
			# url = "https://farm"+photo.farm.to_s+".staticflickr.com/"+photo.server.to_s+"/"+photo.id.to_s+"_"+photo.secret.to_s+"_n.png"
			
			url = "https://c2.staticflickr.com/"+photo.farm.to_s+"/"+photo.server.to_s+"/"+photo.id.to_s+"_"+photo.secret.to_s+"_c.jpg"
			
			# url = flickr.photos.getInfo(:photo_id => photo.id).urls[0]._content
			clause = 'MERGE (c:CoverPhoto{url:"'+url+'"})'
			@neo.execute_query(clause)

			urls.push(url)
			# if count == 15
			# 	break
			# end
			# count = count + 1
		end
		urls
	end
end