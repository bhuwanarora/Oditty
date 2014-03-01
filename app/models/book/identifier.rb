class Book::Identifier < ActiveRecord::Base
	attr_accessible :isbn_10, :lccn, :openlibrary, :oclc, :librarything, :project_gutenberg, :goodreads, :book_id, :isbn_13, :oclc_numbers, :ocaid
	belongs_to :book, :class_name => "::Book"

	def self.create_identifier openlibrary_book_identifier
		delimiter = ","
		isbn_10 = openlibrary_book_identifier["isbn_10"].to_s
		lccn = openlibrary_book_identifier["lccn"].to_s
		openlibrary = openlibrary_book_identifier["openlibrary"].to_s
		oclc = openlibrary_book_identifier["oclc"].to_s
		librarything = openlibrary_book_identifier["librarything"].to_s
		project_gutenberg = openlibrary_book_identifier["project_gutenberg"].to_s
		goodreads = openlibrary_book_identifier["goodreads"].to_s
		Book::Identifier.create(:isbn_10 => isbn_10, 
								:lccn => lccn, 
								:openlibrary => openlibrary, 
								:oclc => oclc, 
								:librarything => librarything, 
								:project_gutenberg => project_gutenberg, 
								:goodreads => goodreads)
	end


	private
		def string_to_array str
			delimiter = ","
			str.split(delimiter)
		end
	
end
