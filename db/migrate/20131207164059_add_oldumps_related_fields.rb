class AddOldumpsRelatedFields < ActiveRecord::Migration
  def change
  	add_column :book_identifiers, :ocaid, :string
  	add_column :book_identifiers, :oclc_numbers, :string
  end
end
