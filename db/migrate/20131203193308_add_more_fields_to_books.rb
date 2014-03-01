class AddMoreFieldsToBooks < ActiveRecord::Migration
  def change
  	add_column :books, :physical_format, :string
  	add_column :books, :url, :string
  end
end
