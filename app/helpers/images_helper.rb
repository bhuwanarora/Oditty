module ImagesHelper
	def self.init_base_url
		@base_url = "https://s3-ap-southeast-1.amazonaws.com/rd-genres/"
	end

	def self.set_genre_images
		images = [
			{:key => "art.jpg", :name => "Arts & Photography"},
			{:key => "biographies.jpg", :name => "Biographies & Memoirs"},
			{:key => "business.jpg", :name => "Business & Investing"},
			{:key => "children.jpg", :name => "Children's Books"},
			{:key => "comics.jpg", :name => "Comics & Graphic Novels"},
			{:key => "computers.jpg", :name => "Computers & Internet"},
			{:key => "cooking.jpg", :name => "Cooking, Food & Wine"},
			{:key => "entertainment.jpg", :name => "Entertainment"},
			{:key => "gay_and_lesbian.jpg", :name => "Gay & Lesbian"},
			{:key => "health.jpg", :name => "Health, Mind & Body"},
			{:key => "history.jpg", :name => "History"},
			{:key => "home.jpg", :name => "Home & Garden"},
			{:key => "law.jpg", :name => "Law"},
			{:key => "literature.jpg", :name => "Literature & Fiction"},
			{:key => "medicine.jpg", :name => "Medicine"},
			{:key => "mystery.jpg", :name => "Mystery & Thrillers"},
			{:key => "nature.jpg", :name => "Outdoors & Nature"},
			{:key => "non_fiction.jpg", :name => "Nonfiction"},
			{:key => "parenting.jpg", :name => "Parenting & Families"},
			{:key => "reference.jpg", :name => "Reference"},
			{:key => "religion.jpg", :name => "Religion & Spirituality"},
			{:key => "romance.jpg", :name => "Romance"},
			{:key => "science.jpg", :name => "Science"},
			{:key => "science_fiction.jpg", :name => "Science Fiction & Fantasy"},
			{:key => "sports.jpg", :name => "Sports"},
			{:key => "technical.jpg", :name => "Professional & Technical"},
			{:key => "teens.jpg", :name => "Teens"},
			{:key => "travel.jpg", :name => "Travel"}
		]

		@neo = Neography::Rest.new
		for image in images
			clause = "MATCH (c:Category) WHERE c.is_root = true AND c.name =\""+image[:name]+"\" SET c.aws_key ='"+image[:key]+"'"
			puts clause.blue.on_red
			@neo.execute_query clause
		end
	end
end