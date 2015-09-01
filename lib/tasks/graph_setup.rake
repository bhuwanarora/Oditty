namespace :graph do

  # desc "remove rubbish labels"
  # task :delete_labels => :environment do
  #   include Neo4jHelper
  #   Neo4jHelper.delete_labels
  # end

  desc "set author circular linked list"
  task :set_author_feed => :environment do
    include GraphHelper
    GraphHelper.set_author_feed
  end

  desc "reset user feedNext circlular linked list"
  task :reset_user_feed => :environment do
    include CircularLinkedListHelper
    CircularLinkedListHelper.reset_feednext_circular_list
  end

  desc "set self link of type bookFeed on those books for which no feed exist "
  task :set_book_feed => :environment do
    include GraphHelper
    GraphHelper.set_book_feed
  end

  desc "create_linked_list"
  task :create_linked_list => :environment do
    include Neo4jHelper
    Neo4jHelper.create_linked_list
  end

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

  desc "set book metrics"
  task :set_book_metrics => :environment do
    include BookHelper
    BookHelper.set_metrics
  end

  desc "create book metric logs"
  task :create_book_metric_logs, [:logfilename] => :environment do |t,args|
    include AnalyticsHelper
    AnalyticsHelper.analyse_books args[:logfilename]
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

  desc " set search_index and indexed_main_author_name for authors"
  task :set_author_search_indices => :environment do
    include AuthorsHelper
    AuthorsHelper.set_search_indices
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

  desc " Add label_bookshelf"
  task :add_label_bookshelf => :environment do
    include Neo4jHelper
    Neo4jHelper.set_bookshelf_label
  end

  desc " set_bookshelf_label"
  task :set_bookshelf_label => :environment do
    include Neo4jHelper
    Neo4jHelper.set_bookshelf_label
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

  desc "Deletes duplicate authors and appropriately setup links."
  task :remove_duplicate_authors => :environment do
    include GraphHelper
    GraphHelper.merge_duplicate_authors
  end

  desc " Removes deleted authors from search. Requires log file"
  task :remove_duplicate_authors_from_search => :environment do
    include AuthorsHelper
    AuthorsHelper.handle_duplicate_removal_log_file
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

  desc "set books_count for authors "
  task :set_author_books_count => :environment do
    include GraphHelper
    GraphHelper.set_author_books_count
  end

  desc "update_follow_counts_for_user"
  task :update_follow_counts_for_user => :environment do
    include GraphHelper
    GraphHelper.update_follow_counts_for_user
  end

  desc "update_followed_by_counts_for_user"
  task :update_followed_by_counts_for_user => :environment do
    include GraphHelper
    GraphHelper.update_followed_by_counts_for_user
  end

  desc "reset links to books for communities before a timestamp"
  task :reset_community_to_book_links => :environment do
    include CommunitiesHelper
    created_before = Time.local(2015, 5, 20).to_i
    CommunitiesHelper.reset_book_links created_before
  end

  desc "makes communities with no books invisible from website "
  task :handle_bookless_communities => :environment do
    include CommunitiesHelper
    CommunitiesHelper.handle_bookless_communities
  end

  desc "bookmark_count for user"
  task :set_user_bookmark_count => :environment do
    include GraphHelper
    GraphHelper.user_set_bookmark_count
  end

  desc "set user notification circular linked list"
  task :set_user_notification => :environment do
    include GraphHelper
    GraphHelper.set_user_notification
  end

  desc "remove global Visited node"
  task :remove_global_visited => :environment do
    include GraphHelper
    GraphHelper.remove_global_visited
  end

  desc "fix_user_linked_feed"
  task :fix_user_linked_feed => :environment do
    include GraphHelper
    GraphHelper.fix_user_linked_feed
  end

  desc "fix_user_notification_feed"
  task :fix_user_notification_feed => :environment do
    include GraphHelper
    GraphHelper.fix_user_notification_feed
  end

  desc "Makes super communities AS community and 'hide' all member communities"
  task :handle_super_communities => :environment do
    include SuperCommunitiesHelper
    SuperCommunitiesHelper.handle_super_communities
  end

  desc " handle newly add community after cluster creation "
  task :handle_new_community_with_supercommunity => :environment do
    include SuperCommunitiesHelper
    SuperCommunitiesHelper.handle_new_communities
  end

  desc "reset_user_notification"
  task :reset_user_notification => :environment do
    include GraphHelper
    GraphHelper.reset_user_notification
  end

  desc "handle wrongly linked news"
  task :reset_news_to_community_for_wrongly_linked_news => :environment do
    include NewsHelper
      NewsHelper.handle_wrong_communities_linkage
  end

  desc "merge genre with category"
  task :merge_genre_with_category => :environment do
    include GenreHelper
    GenreHelper.merge_with_category
  end

  desc "set indices for genre and category"
  task :set_category_genre_indices => :environment do
    include GenreHelper
    GenreHelper.set_search_indices
  end

  desc "reset links from community to video"
  task :set_community_video_links => :environment do
    include VideoHelper
    VideoHelper.repair_video_links_to_community
  end

  desc " tests some function which one wants to test. "
  task :test_function => :environment do
    include GraphHelper
    GraphHelper.test_function
  end
end