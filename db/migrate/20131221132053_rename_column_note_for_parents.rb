class RenameColumnNoteForParents < ActiveRecord::Migration
  def change
  	rename_column :note_for_parents_shelfari_books, :notes_for_parent_id, :note_for_parent_id
  end
end
