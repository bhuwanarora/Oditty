class AddWikiUrlToAuthors < ActiveRecord::Migration
  def change
  	add_column :authors, :wiki_url, :text
  	add_column :authors, :comments, :text
  end
end
