class RenameEBookIdInJointTable < ActiveRecord::Migration
  def change
  	rename_column :ebooks_shelfari_books, :e_book_id, :ebook_id
  end
end
