namespace :publisher do

	desc "set seed publisher"
    task :set_seed_publisher => :environment do
    	require 'publisher'
    	Publisher.set_seed_info
  	end
end