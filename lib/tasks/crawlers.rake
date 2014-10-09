namespace :crawl do

  desc "set_book_active"
  task :set_book_active => :environment do
    include Neo4jHelper
    Neo4jHelper.set_book_active
  end

  
  desc "upload_cover_photos"
  task :upload_cover_photos => :environment do
    include S3UploaderHelper
    S3UploaderHelper.upload_cover_photos
  end

  desc "get_cover_photos"
  task :get_cover_photos => :environment do
    include FlickrHelper
    FlickrHelper.get_cover_photos
  end

  desc "get_images"
  task :get_images => :environment do
    include S3UploaderHelper
    S3UploaderHelper.get_images
  end

  desc "upload_author_images"
  task :upload_author_images => :environment do
    include S3UploaderHelper
    S3UploaderHelper.upload_author_images
  end
  

  desc "get_images"
  task :get_images2 => :environment do
    include S3UploaderHelper
    S3UploaderHelper.get_images2
  end

  desc "facebook emotions"
  task :facebook_emotions => :environment do
    include ShelfariCrawler
    ShelfariCrawler.facebook_crawl
  end

  desc "shelfari books list"
  task :shelfari_books_list => :environment do
    include ShelfariCrawler
    ShelfariCrawler.get_books
  end

  desc "shelfari books details"
  task :book_details => :environment do
  	include ShelfariCrawler
  	ShelfariCrawler.crawl_books
  end

  desc "ol dump parsing"
  task :ol_dump => :environment do
  	include FileParser
  	FileParser.open_file
  end

  desc "shelfari authors"
  task :authors => :environment do
    include ShelfariCrawler
    ShelfariCrawler.get_authors
  end

  desc "goodreads genres"
  task :goodreads_genres => :environment do
    include GenreList
    GenreList.parse
  end

  desc "goodreads books list"
  task :goodreads_books_list => :environment do
    include GenreList
    GenreList.get_books
  end

  desc "update goodreads book count"
  task :update_book_count => :environment do
    include GenreList
    GenreList.update_book_count
  end

  desc "goodreads books details"
  task :parse_goodreads_books => :environment do
    include GenreList
    GenreList.parse_books
  end

  desc "get wiki author links"
  task :wiki_authors => :environment do
    include WikiCrawler
    WikiCrawler.get_author_links
  end

  desc "get wiki author details"
  task :wiki_author_details => [:environment] do
    include WikiCrawler
    WikiCrawler.get_author_details
  end

end

namespace :seed do 

  desc "AuthorCrawlStatus seed"
  task :author_crawl_status => :environment do
    AuthorCrawlStatus.delete_all
    for i in 1..1299999 do
      puts i
      AuthorCrawlStatus.create(:page_number => i.to_s)
    end
  end

  desc "Seed Ol Dump"
  task :ol_dump => :environment do
    include FileParser
    FileParser.file_parser
  end

end