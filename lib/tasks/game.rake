namespace :game do
	desc "reset book by cover game"
	task :reset_book_by_cover => :environment do
		GameHelper.create_book_linked_list_all_types
	end
	
end