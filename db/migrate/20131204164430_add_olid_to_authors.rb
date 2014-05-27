class AddOlidToAuthors < ActiveRecord::Migration
  def change
  	add_column 	:authors, :olid, :string
  	add_index	:authors, :olid 
  end
end
