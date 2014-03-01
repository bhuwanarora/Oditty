module BookRecommendation

	def get_similar_books book_id
		# @book = Book.find(book_id)
		# @categories = @book.categories
		# book_count = Hash.new
		# @categories.each do |category|
		# 	category.books.each do |book|
		# 		if book_count[book.id+"_"+book.name]
		# 			book_count[book.id+"_"+book.name] |= [category.id+"_"+category.name]
		# 		else
		# 			book_count[book.id+"_"+book.name] = [category.id+"_"+category.name]
		# 		end
		# 	end
		# end
		# Hash[book_count.sort_by {|k, v| v.length}.reverse]
		#this will give the similar books first
	end

	def get_books_belonging_to_category
	end

	def get_serendipitous_books
	end

	def get_books_for_similar_users
	end

end