class AddOtherFieldsToBooks < ActiveRecord::Migration
  def change
  	add_column :books, :table_of_contents, :text
  	add_column :books, :contributions, :text
  	add_column :books, :edition_name, :string
  	add_column :books, :type, :string
  	add_column :books, :notes, :text

  	add_column :books, :subtitles, :string
  	add_column :books, :title_prefix, :string
  	add_column :books, :physical_dimensions, :string
  	add_column :books, :works, :text
  	add_column :books, :description, :text
  	add_column :books, :work_titles, :string

  	add_index :book_series, :name
  	add_index :books, :title
  end
end