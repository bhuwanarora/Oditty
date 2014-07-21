class Book::SubjectTime < ActiveRecord::Base
	attr_accessible :name, :url
	has_and_belongs_to_many :books, :class_name => "::Book"

	def self.create_subject_times openlibrary_subject_times
		@subject_times = []
		unless openlibrary_subject_times.nil?
			openlibrary_subject_times.each do |subject_time|
				@subject_time = Book::SubjectTime.find_by_name(subject_time["name"])
				unless @subject_time.present?
					@subject_time = Book::SubjectTime.new(:name => subject_time["name"], :url => subject_time["url"])
					if @subject_time.save
						@subject_times |= [@subject_time]
					end
				else
					@subject_times |= [@subject_time]
				end
			end
			@subject_times
		end
	end
end
