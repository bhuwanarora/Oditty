class AddOverviewOfAuthor < ActiveRecord::Migration
  def change
  	add_column :authors, :overview, :text
  	add_column :authors, :shelfari_url, :text
  	add_column :authors, :flag, :boolean
  end
end
