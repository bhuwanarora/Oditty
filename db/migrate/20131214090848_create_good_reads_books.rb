class CreateGoodReadsBooks < ActiveRecord::Migration
  def change
    create_table :good_reads_books do |t|
    	t.text :url
    	t.text :description
    	t.string :rating
    	t.string :title
    	t.string :authorName
    	t.string :isbn


      	t.timestamps
    end

    create_table :good_reads_books_genres do |t|
    	t.belongs_to :good_reads_genre
    	t.belongs_to :good_reads_book

    	t.timestamps
    end
  end
end
