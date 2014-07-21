puts "Enter icons for categories..."
ShelfariCategories = [{:name => "Entertainment", :icon => "icon-uniF538"},
			{:name => "Biographies & Memoirs", :icon => "icon-uniF54D"},
			{:name => "Cooking, Food & Wine", :icon => "icon-mug"},
			{:name => "Health, Mind & Body", :icon => "icon-aid"},
			{:name => "Arts & Photography", :icon => "icon-camera"},
			{:name => "History", :icon => "icon-clock2"},
			{:name => "Children's Books", :icon => "icon-uniF555"},
			{:name => "Comics & Graphic Novels", :icon => "icon-blackberry"},
			{:name => "Home & Garden", :icon => "icon-home2"},
			{:name => "Gay & Lesbian", :icon => "icon-female"},
			{:name => "Law", :icon => "icon-law"},
			{:name => "Medicine", :icon => "icon-pil"},
			{:name => "Mystery & Thrillers", :icon => "icon-jason"},
			{:name => "Outdoors & Nature", :icon => "icon-island"},
			{:name => "Literature & Fiction", :icon => "icon-fire"},
			{:name => "Professional & Technical", :icon => "icon-file"},
			{:name => "Business & Investing", :icon => "icon-portfolio"},
			{:name => "Nonfiction", :icon => "icon-bolt"},
			{:name => "Computers & Internet", :icon => "icon-screen2"},
			{:name => "Parenting & Families", :icon => "icon-uniF7C9"},
			{:name => "Romance", :icon => "icon-hearts"},
			{:name => "Reference", :icon => "icon-barcode"},
			{:name => "Teens", :icon => "icon-uniF6D8"},
			{:name => "Travel", :icon => "icon-truck"},
			{:name => "Religion & Spirituality", :icon => "icon-library"},
			{:name => "Science Fiction & Fantasy", :icon => "icon-puzzle-piece"},
			{:name => "Science", :icon => "icon-atom"},
			{:name => "Sports", :icon => "icon-baseball"}
		]

ShelfariCategory.first.children.each do |category|
	ShelfariCategories.each do |icon|
		if icon[:name] == category.name
			category.update_column(:icon, icon[:icon])
			break
		end
	end
end