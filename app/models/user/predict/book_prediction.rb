class User::Predict::BookPrediction < User::Predict
	Limit = 30


	def initialize(user_id, skip_count)
		@user_id = user_id
		@skip_count = skip_count
		@user = User.new(user_id)
	end

	def likely_books_read
		range = @user.get_init_book_count_range.execute[0]["init_book_read_count"]
		case range
		when Constant::Range::ChildBookCount
			data = handle_few_books_read
		when Constant::Range::AdoloscentBookCount
			data = handle_average_number_books_read
		when Constant::Range::AboutToBeAdultBookCount
			data = handle_average_number_books_read
		when Constant::Range::AdultBookCount
			data = handle_average_number_books_read
		when Constant::Range::AboutToDieBookCount
			data = handle_average_number_books_read
		end
		data
	end

	def handle_average_number_books_read
		data = @user.get_all_books(@skip_count).execute
		has_linked_books = data[0]["book_id"].blank? ? false : true rescue false
		unless has_linked_books
			data = []
		end
		clause =  Book::LongRead.get_sorted_books @skip_count
		data |= clause.execute
		data
	end

	def handle_few_books_read 
		data = @user.get_all_books(@skip_count).execute

		has_linked_books = data[0]["book_id"].blank? ? false : true rescue false
		unless has_linked_books
			data = []
		end
		clause =  Book::SmallRead.get_sorted_books @skip_count
		data |= clause.execute
		# end
		data
	end
end