namespace :graph do

  # desc "remove rubbish labels"
  # task :delete_labels => :environment do
  #   include Neo4jHelper
  #   Neo4jHelper.delete_labels
  # end

  desc "reset_news_link"
  task :reset_news_link => :environment do
    include GraphHelper
    GraphHelper.reset_news_link
  end

  desc "set book article shelf"
  task :make_book_and_article_shelves => :environment do
    include GraphHelper
    GraphHelper.make_book_and_article_shelves
  end

  desc "set region news count"
  task :set_region_news_count => :environment do
    include GraphHelper
    GraphHelper.set_region_news_count
  end

  desc "Category linked list"
  task :set_category_linked_list => :environment do
    include GraphHelper
    GraphHelper.set_category_linked_list
  end

  desc "Era linked list"
  task :set_era_linked_list => :environment do
    include GraphHelper
    GraphHelper.set_era_linked_list
  end

  desc " create root blog node and fetch all blogs "
  task :set_blogs => :environment do
    include GraphHelper
    GraphHelper.set_blogs
  end

  task :set_index => :environment do
    include GraphHelper
    GraphHelper.set_index
  end

  desc "set_genre_linked_list"
  task :set_genre_linked_list => :environment do
    include GraphHelper
    GraphHelper.set_genre_linked_list
  end

  desc "set_day_linked_list"
  task :set_day_linked_list => :environment do
    include GraphHelper
    GraphHelper.set_day_linked_list
  end


  task :add_labels_to_existing_user => :environment do
    include Neo4jHelper
    Neo4jHelper.add_labels_to_existing_user
  end

  desc "add_new_labels"
  task :add_new_labels => :environment do
    include Neo4jHelper
    Neo4jHelper.add_new_labels
  end

  desc "set_author_rating"
  task :set_author_rating => :environment do
    include Neo4jHelper
    Neo4jHelper.set_author_rating
  end

  desc "remove_attherate"
  task :remove_attherate => :environment do
    include Neo4jHelper
    Neo4jHelper.remove_attherate
  end

  desc "remove_less"
  task :remove_less => :environment do
    include Neo4jHelper
    Neo4jHelper.remove_less
  end
  
  desc "set_total_weight"
  task :set_total_weight => :environment do
    include Neo4jHelper
    Neo4jHelper.set_total_weight
  end
  
  desc "set_star_genres"
  task :set_star_genres => :environment do
    include Neo4jHelper
    Neo4jHelper.set_star_genres
  end

  desc "set_active_books"
  task :set_active_books => :environment do
    include Neo4jHelper
    Neo4jHelper.set_active_books
  end

  desc "set_year_labels"
  task :set_year_labels => :environment do
    include Neo4jHelper
    Neo4jHelper.set_year_labels
  end

  desc "add_movies"
  task :add_movies => :environment do
    include Neo4jHelper
    Neo4jHelper.add_movies
  end

  desc "add_ebooks"
  task :add_ebooks => :environment do
    include Neo4jHelper
    Neo4jHelper.add_ebooks
  end

  desc "add_genres"
  task :add_genres => :environment do
    include Neo4jHelper
    Neo4jHelper.add_genres
  end
  

  desc "add_categories"
  task :add_categories => :environment do
    include Neo4jHelper
    Neo4jHelper.add_categories
  end

  desc "category tree"
  task :create_category_tree => :environment do
    include Neo4jHelper
    Neo4jHelper.create_category_tree
  end

  desc "remove_tiny_reads_with_zero_count"
  task :remove_tiny_reads_with_zero_count => :environment do
    include Neo4jHelper
    Neo4jHelper.remove_tiny_reads_with_zero_count
  end

  desc "get_best_reads_for_time"
  task :get_best_reads_for_time => :environment do
    include Neo4jHelper
    Neo4jHelper.get_best_reads_for_time
  end

  desc "delete_belongs_to_relationship_on_categoriess"
  task :delete_belongs_to_relationship_on_categories => :environment do
    include Neo4jHelper
    Neo4jHelper.delete_belongs_to_relationship_on_categories
  end

  desc "sorted readtime books"
  task :sorted_readtime_books => :environment do
    include Neo4jHelper
    Neo4jHelper.sorted_readtime_books
  end

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

  desc "Remove un-authored books"
  task :remove_unauthored_books => :environment do
    Book.remove_unauthored_books
  end

  desc "set_book_unique_index"
  task :set_book_unique_index => :environment do
    include Neo4jHelper
    Neo4jHelper.set_book_unique_index
  end


  desc "Deletes duplicate books and appropriately setup links."
  task :remove_duplicate_books => :environment do
    include GraphHelper
    GraphHelper.delete_duplicate_books_unique_index
  end  
  
  desc "curate book author name "
  task :curate_books_author_name => :environment do
    include GraphHelper
    GraphHelper.curate_books_author_name
  end

  desc "curate author names "
  task :curate_author_names => :environment do
    include GraphHelper
    GraphHelper.curate_author_names
  end

  desc "update_follow_counts_for_user"
  task :update_follow_counts_for_user => :environment do
    include GraphHelper
    GraphHelper.update_follow_counts_for_user
  end

end