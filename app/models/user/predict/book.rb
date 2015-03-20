class User::Predict::Book < User::Predict
	Limit = 30


	def initialize(user_id, skip_count)
		@user_id = user_id
		@skip_count = skip_count
		@user = User.new(user_id)
	end

	def likely_books_read
		range = @user.get_init_book_count_range.execute[0]["init_book_read_count"]
		@skip_count = @skip_count.to_i > Limit ? @skip_count.to_i : 0  
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

	def handle_average_number_books_read
	 	
	end

	def handle_few_books_read 
		#FIXME path nodes are increasing with scroll
		clause = @user.match_clause + UsersBook.mark_as_read_clause + UsersBook.rating_clause + return_init +  ::Book.get_basic_info + ::Book.rating + ::Book.mark_as_read
		data = clause.execute

		has_linked_books = data[0]["book_id"].blank? ? false : true rescue false
		unless has_linked_books
			clause =  ::Book::SmallRead.path_nodes(Constants::BestSmallRead.to_s, @skip_count) + return_init + ::Book.get_basic_info + ::Book.order_desc + " LIMIT " + Limit.to_s
			data = clause.execute
		end
		data
	end
end