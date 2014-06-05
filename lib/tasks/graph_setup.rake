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

  desc "Read Time nodes"
  task :read_time => :environment do
    include Neo4jHelper
    Neo4jHelper.create_read_time_groups
  end

  desc "Resolve int bug for rating count etc"
  task :resolve_int_bug => :environment do
    include Neo4jHelper
    Neo4jHelper.resolve_int_bug
  end

  desc "Label reading time"
  task :label_readtime_groups => :environment do
    include Neo4jHelper
    Neo4jHelper.label_readtime_groups
  end
  
end