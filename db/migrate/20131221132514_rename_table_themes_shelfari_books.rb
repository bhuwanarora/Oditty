class RenameTableThemesShelfariBooks < ActiveRecord::Migration
  def change
  	drop_table :themes_shelfari_books
  end
end
