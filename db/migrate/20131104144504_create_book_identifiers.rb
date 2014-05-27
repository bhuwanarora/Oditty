class CreateBookIdentifiers < ActiveRecord::Migration
  def change
    create_table :book_identifiers do |t|
		  t.string :isbn_10
    	t.string :lccn
    	t.string :openlibrary
    	t.string :oclc
    	t.string :librarything
    	t.string :project_gutenberg
    	t.string :goodreads
      t.integer :book_id

      t.timestamps
    end
  end
end
