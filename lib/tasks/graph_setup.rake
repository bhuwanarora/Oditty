namespace :graph do

  desc "index authors"
  task :index_authors => :environment do
    include Neo4jHelper
    Neo4jHelper.index_authors
  end

  desc "grid init"
  task :grids => :environment do
    include Neo4jHelper
    Neo4jHelper.grids
  end
  
  desc "Remove colon database"
  task :remove_colon => :environment do
    include Neo4jHelper
    Neo4jHelper.remove_colon_from_indexed_fields
  end

  desc "Restructure database"
  task :restructure => :environment do
    include Neo4jHelper
    Neo4jHelper.restructure_database
  end

  desc "Recreate Indexes"
  task :recreate_indexes => :environment do
    include Neo4jHelper
    Neo4jHelper.create_new_indexes
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

  desc "Add Shelfari Books"
  task :init_shelfari_books => :environment do
     include Neo4jHelper
     Neo4jHelper.init_shelfari_books
  end
  
end