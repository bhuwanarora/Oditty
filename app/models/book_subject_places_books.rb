class BookSubjectPlacesBooks < ActiveRecord::Base
	attr_accessible :book_id, :subject_place_id
	belongs_to :book
	belongs_to :subject_place, :class_name => "::Book::SubjectPlace"
end
