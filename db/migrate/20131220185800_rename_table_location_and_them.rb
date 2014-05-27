class RenameTableLocationAndThem < ActiveRecord::Migration
  def change
  	rename_table :location, :locations
  	rename_table :theme, :themes
  end
end
