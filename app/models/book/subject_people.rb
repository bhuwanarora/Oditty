class Book::SubjectPeople < ActiveRecord::Base
	attr_accessible :name, :url
	has_and_belongs_to_many :books, :class_name => "::Book"

	def self.create_subject_people openlibrary_subject_people
		@subject_people_group = []
		unless  openlibrary_subject_people.nil?
			openlibrary_subject_people.each do |subject_people|
				@subject_people = Book::SubjectPeople.find_by_name(subject_people["name"])
				unless @subject_people.present?
					@subject_people = Book::SubjectPeople.new(:name => subject_people["name"], :url => subject_people["url"])
					if @subject_people.save
						@subject_people_group |= [@subject_people]
					end
				else
					@subject_people_group |= [@subject_people]
				end
			end
			@subject_people_group
		end
	end
end
