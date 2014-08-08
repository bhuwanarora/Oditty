class AddFlagsToShelfaribook < ActiveRecord::Migration
  def change
  	add_column :shelfari_books, :movie_flag, :boolean
  	add_column :shelfari_books, :category_flag, :boolean
  	add_column :shelfari_books, :genre_flag, :boolean
  	add_column :shelfari_books, :ebook_flag, :boolean
  	add_column :shelfari_books, :note_flag, :boolean
  end
end
