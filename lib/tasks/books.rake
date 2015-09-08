namespace :books do
	desc " add author id to book nodes"
	task :add_author_id => :environment do
		BookHelper.add_author_id
	end
	
end