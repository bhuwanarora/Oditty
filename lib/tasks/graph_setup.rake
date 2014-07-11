namespace :graph do

  desc "Restructure database"
  task :restructure => :environment do
    include Neo4jHelper
    Neo4jHelper.restructure_database
  end

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

  desc "goodreads book nodes"
  task :goodreads_books_rev => :environment do
    include Neo4jHelper
    Neo4jHelper.init_goodreads_books_reverse
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

  desc " Add Labels"
  task :add_labels => :environment do
    include Neo4jHelper
    Neo4jHelper.create_labels
  end

  desc "Add Graph Indexes"
  task :create_indexes => :environment do
    include Neo4jHelper
    Neo4jHelper.create_indexes
  end

  desc "Create Constraints"
  task :add_constraints => :environment do
    include Neo4jHelper
    Neo4jHelper.add_constraints
  end
  
end