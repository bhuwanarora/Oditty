class AddDataFlagToShelfariBook < ActiveRecord::Migration
  def change
  	add_column :shelfari_books, :data_flag, :boolean
  end
end
