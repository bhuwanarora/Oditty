class AddIconToShelfariCategory < ActiveRecord::Migration
  def change
  	add_column :shelfari_categories, :icon, :string
  end
end
