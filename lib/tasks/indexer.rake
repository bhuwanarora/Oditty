namespace :index do

	desc "index books"
	task :book => :environment do
	    Indexer.create_index("Book", Book)
	end

	desc "index blog"
	task :blog => :environment do
	    Indexer.create_index("Blog", Blog)
	end

	desc "index news"
	task :news => :environment do
	    Indexer.create_index("News", News)
	end

	desc "index user"
	task :user => :environment do
	    Indexer.create_index("User", User)
	end

	desc "index author"
	task :author => :environment do
	    Indexer.create_index("Author", Author)
	end

	desc "index community"
  	task :community => :environment do
    	Indexer.create_index("Community", Community)
 	end

	desc "set index"
  	task :set_index => :environment do
    	Indexer.set_index 
 	end
end

