image_urls = ["assets/Optimized-7H.jpg", "assets/72H.jpg", "assets/kansas.jpg", 
	"assets/sp1.jpg", "assets/sp2.jpg"]
puts "search page background images..."
image_urls.each do |image_url|
	SearchPage.find_or_create_by(:background_image_url => image_url)
end