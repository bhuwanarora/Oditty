class AddBlueFlagToShefariCategories < ActiveRecord::Migration
  def change
  	add_column :shelfari_categories, :blue_flag, :boolean
  end
end
