puts "Enter root category..."
Category.find_or_create_by_name("ROOT")
ShelfariCategory.find_or_create_by_name("ROOT")