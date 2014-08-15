class ShelfariBooksTags < ActiveRecord::Base
	attr_accessible :shelfari_book_id, :shelfari_tag_id, :weight, :genre_flag
	belongs_to :shelfari_tag
	belongs_to :shelfari_book
end