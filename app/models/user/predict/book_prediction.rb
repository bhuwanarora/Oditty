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
		when Constants::ChildBookCountRange
			data = handle_few_books_read
		when Constants::AdoloscentBookCountRange
			data = handle_average_number_books_read
		when Constants::AboutToBeAdultBookCountRange
			data = handle_average_number_books_read
		when Constants::AdultBookCountRange
			data = handle_average_number_books_read
		when Constants::AboutToDieBookCountRange
			data = handle_average_number_books_read
		end
		data
	end

	def handle_average_number_books_read skip_count=0, limit_count = Constants::BookCountShownOnSignup
		data = @user.get_all_books.execute
	 	has_linked_books = data[0]["book_id"].blank? ? false : true rescue false
		unless has_linked_books
			clause = @user.match + User.match_likeable_root_category + ::Category::Root.get_books_for_user(skip_count, limit_count) + self.return_group(Book.basic_info)
			data = clause.execute
	 	end
	 	data
	end

	def handle_few_books_read 
		data = @user.get_all_books.execute

		has_linked_books = data[0]["book_id"].blank? ? false : true rescue false
		unless has_linked_books
			clause =  ::Book::SmallRead.get_sorted_books @skip_count
			data = clause.execute
		end
		data
	end
end