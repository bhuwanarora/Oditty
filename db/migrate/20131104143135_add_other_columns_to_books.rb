class AddOtherColumnsToBooks < ActiveRecord::Migration
  def change
  	add_column :books, :subtitle, :string
  	add_column :books, :link, :string
  	rename_column :books, :name, :title
  	rename_column :books, :description, :excerpts
  	add_column :books, :weight, :integer
  end
end