class AddTableNotesForParents < ActiveRecord::Migration
  def change
  	create_table :notes_for_parents do |t|
  		t.text		:url
  		t.string	:name

  		t.timestamps
  	end

  	create_table :notes_for_parents_shelfari_books do |t|
  		t.belongs_to :notes_for_parent
  		t.belongs_to :shelfari_book

  		t.timestamps
  	end
  end
end
