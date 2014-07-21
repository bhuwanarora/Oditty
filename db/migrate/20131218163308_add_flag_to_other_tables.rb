class AddFlagToOtherTables < ActiveRecord::Migration
  def change
  	add_column :books, :flag, :boolean
  end
end
