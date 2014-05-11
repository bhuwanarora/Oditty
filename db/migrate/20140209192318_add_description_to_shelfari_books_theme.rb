class AddDescriptionToShelfariBooksTheme < ActiveRecord::Migration
  def change
  	add_column :shelfari_books_themes, :description, :text
  	add_column :locations_shelfari_books, :description, :text
  	add_column :movies_shelfari_books, :description, :text
  end
end
