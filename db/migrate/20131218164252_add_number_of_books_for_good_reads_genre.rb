class AddNumberOfBooksForGoodReadsGenre < ActiveRecord::Migration
  def change
  	add_column :good_reads_genres, :book_count, :integer
  end
end
