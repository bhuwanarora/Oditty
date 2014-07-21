class AddFieldsToGoodreadsBooks < ActiveRecord::Migration
  def change
  	add_column :good_reads_books, :authorUrl, :text
  	add_column :good_reads_books, :reviews_count, :string
  	add_column :good_reads_books, :ratings_count, :string
  	add_column :good_reads_books, :page_count, :string
  	add_column :good_reads_books, :published_year, :string
  end
end
