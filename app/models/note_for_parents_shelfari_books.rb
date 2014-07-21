class NoteForParentsShelfariBooks < ActiveRecord::Base
	attr_accessible :note_for_parent_id, :shelfari_book_id
	belongs_to :shelfari_book
	belongs_to :note_for_parent
end