class HandleRailsAdminRelatedChanges < ActiveRecord::Migration
  def change
  	rename_table :authors_and_prizes, :authors_prizes
  	rename_table :book_subject_peoples_books, :book_subject_people_books

  	create_table :books_categories do |t|
  		t.belongs_to :book
  		t.belongs_to :category

  		t.timestamps
  	end
  end
end
