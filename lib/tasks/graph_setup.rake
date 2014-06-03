namespace :graph do

  desc "time nodes"
  task :time_nodes => :environment do
    include Neo4jHelper
    Neo4jHelper.create_time_nodes
  end

  desc "goodreads book nodes"
  task :goodreads_books => :environment do
    include Neo4jHelper
    Neo4jHelper.init_goodreads_books
  end  

  desc "Time Group nodes"
  task :era => :environment do
    include Neo4jHelper
    Neo4jHelper.create_time_groups
  end  

end