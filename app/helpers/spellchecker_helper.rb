module SpellcheckerHelper
	def self.write_books_to_text_file
		File.open('books.txt', 'w') do |file|
			GoodReadsBook.pluck(:title).each do |name|
				puts name
				file.write(name)
			end
		end
	end

	def self.write_authors_to_text_file
		File.open('authors.txt', 'w') do |file|
			HumanProfile.pluck(:name).each do |name|
				puts name
				file.write(name)
			end
		end
	end
end