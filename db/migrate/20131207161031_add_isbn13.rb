class AddIsbn13 < ActiveRecord::Migration
  def change
  	add_column :book_identifiers, :isbn_13, :string
  end
end
