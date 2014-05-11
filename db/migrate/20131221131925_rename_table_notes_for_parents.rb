class RenameTableNotesForParents < ActiveRecord::Migration
  def change
  	rename_table :notes_for_parents, :note_for_parents
  	rename_table :notes_for_parents_shelfari_books, :note_for_parents_shelfari_books
  end
end
