class AddFlagsToJointTables < ActiveRecord::Migration
  def change
  	add_column :shelfari_books_tags, :genre_flag, :boolean
  	add_column :shelfari_books_categories, :category_flag, :boolean
  end
end
