module ImageServiceHelper
	def get_dominant_color isbn
		image_service_url = Rails.Application.config.image_service
		image_url = "http://covers.openlibrary.org/b/isbn/" + isbn.split(",").first + "-M.jpg"
		request = image_service_url + "?image_url=" + image_url
		dominant_color = Net::HTTP.get(URI.parse(request))
	end
end