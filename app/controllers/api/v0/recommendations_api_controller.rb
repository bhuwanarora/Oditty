module Api
	module V0
		class RecommendationsApiController < ApplicationController
			# include 'Pubnub'

			def initiate_push
				# init
				# subscribe
				# publish
			end

			def filters
				filters_book = Filter.where(:filter_type => "BOOK")
								.order(:priority)
								.select("id, name, priority").limit(6)
								.as_json
				filter_author = Filter.where(:filter_type => "AUTHOR")
								.order(:priority)
								.select("id, name, priority").limit(6)
								.as_json
				filter_reader = Filter.where(:filter_type => "READER")
								.order(:priority)
								.select("id, name, priority").limit(6)
								.as_json
				render :json => {:filters => {
									"book" => filters_book, 
									"author" => filter_author,
									"reader" => filter_reader
								}}, :status => 200
			end

			def push_recommendations
				test_book = {:title => "Siddhrtha",
							  :author_name => "P. D. Smith",
							  :tags => [
							  	{:name => "Philosophy", :url => "javascript:void(0);"},
							  	{:name => "India", :url => "javascript:void(0);"},
							  	{:name => "Spirituality", :url => "javascript:void(0);"}
							  ],
							  :book_thumb => {
							  	
							  },
							  :rating => 4,
							  :status => 0,
							  :bookmark_status => 1,
							  :readers_count => "1112",
							  :discussions_count => "123",
							  :reviews_count => "51",
							  :news => [{:description => "Billy Corgan to Perform Eight-Hour Ambient Jam Inspired by Hermann 
							  	Hesse's Siddhartha", :from => "Lindsay Zoladz"}, 
							  	{:description => "Billy Corgan to Perform Eight-Hour Ambient Jam Inspired by Hermann 
							  	Hesse's Siddhartha", :from => "Lindsay Zoladz"},]
						  }
				test_book = test_book.merge(
					:book_thumb => {
						:book_cover_url => "assets/books/a2.jpeg",
						:description => "Siddhartha is a novel by Hermann Hesse that deals with the spiritual journey of 
						self-discovery of a man named Siddhartha during the time of the Gautama Buddha. The book, Hesse's ninth 
						novel, was written in German, in a simple, lyrical style. It was published in the U.S. in 1951 and became 
						influential during the 1960s. Hesse dedicated Siddhartha to his wife Ninon and supposedly afterwards to 
						Romain Rolland and Wilhelm Gundert. The word Siddhartha is made up of two words in the Sanskrit language, 
						siddha + artha, which together means he who has found meaning",
						:background_color => "#F9B131"},
					:category => {:name => "Hermann Hesse Fan", 
								:url => "javascript:void(0);",
								:background_color => "#3cb878",
								:description => ""},
					:id => 13)
				render :json => {:recommendations => {:books => [test_book]}}, :status => 200
			end

			def recommendations
				# filters list Filter.where(:id => JSON.parse(params[:q])["more_filters"])
				test_name = Filter.where(:id => JSON.parse(params[:q])["more_filters"]).pluck(:name) rescue "City"

				test_book = {:title => test_name[0],
							  :author_name => "P. D. Smith",
							  :tags => [
							  	{:name => "Philosophy", :url => "javascript:void(0);"},
							  	{:name => "Art", :url => "javascript:void(0);"},
							  	{:name => "20th Century", :url => "javascript:void(0);"}
							  ],
							  :book_thumb => {
							  	
							  },
							  :rating => 5,
							  :status => 0,
							  :bookmark_status => 1,
							  :readers_count => "112",
							  :discussions_count => "23",
							  :reviews_count => "5",
							  :news => [{:description => "", :from => ""}]
						  }
				test_book1 = test_book.merge(
					:book_thumb => {
						:book_cover_url => "assets/books/20.jpeg",
						:description => "Psychiatry is a novel by Hermann Hesse that deals with the spiritual journey of 
						self-discovery of a man named Siddhartha during the time of the Gautama Buddha. The book, Hesse's ninth 
						novel, was written in German, in a simple, lyrical style. It was published in the U.S. in 1951 and became 
						influential during the 1960s. Hesse dedicated Siddhartha to his wife Ninon and supposedly afterwards to 
						Romain Rolland and Wilhelm Gundert. The word Siddhartha is made up of two words in the Sanskrit language, 
						siddha + artha, which together means he who has found meaning",
						:background_color => "#915972"},
					:category => {:name => "Must Read", 
								:url => "javascript:void(0);", 
								:background_color => "#3cb878", 
								:description => "Highly rated book"},
					:id => 1)

				test_book2 = test_book.merge(
					:book_thumb => {
						:book_cover_url => "assets/books/10.jpg",
						:description => "Psychiatry is a novel by Hermann Hesse that deals with the spiritual journey of 
						self-discovery of a man named Siddhartha during the time of the Gautama Buddha. The book, Hesse's 
						ninth novel, was written in German, in a simple, lyrical style. It was published in the U.S. in 1951 
						and became influential during the 1960s. Hesse dedicated Siddhartha to his wife Ninon and supposedly 
						afterwards to Romain Rolland and Wilhelm Gundert. The word Siddhartha is made up of two words in the 
						Sanskrit language, siddha + artha, which together means he who has found meaning",
						:background_color => "#E9BC4B"},
					:category => {:name => "Quick Read", 
								:url => "javascript:void(0);", 
								:background_color => "#790000",
								:description => ""},
					:id => 2)


				test_book3 = test_book.merge(
					:book_thumb => {
						:book_cover_url => "assets/books/11.jpeg",
						:description => "Psychiatry is a novel by Hermann Hesse that deals with the spiritual journey of 
						self-discovery of a man named Siddhartha during the time of the Gautama Buddha. The book, Hesse's 
						ninth novel, was written in German, in a simple, lyrical style. It was published in the U.S. in 1951 
						and became influential during the 1960s. Hesse dedicated Siddhartha to his wife Ninon and supposedly 
						afterwards to Romain Rolland and Wilhelm Gundert. The word Siddhartha is made up of two words in the 
						Sanskrit language, siddha + artha, which together means he who has found meaning",
						:background_color => "#F4EFE9"},
					:category => {:name => "Recommendation From Friends", 
								:url => "javascript:void(0);", 
								:background_color => "#0054a6",
								:description => ""},
					:id => 3)


				test_book4 = test_book.merge(
					:book_thumb => {
						:book_cover_url => "assets/books/13.jpeg",
						:description => "Psychiatry is a novel by Hermann Hesse that deals with the spiritual journey of 
						self-discovery of a man named Siddhartha during the time of the Gautama Buddha. The book, Hesse's 
						ninth novel, was written in German, in a simple, lyrical style. It was published in the U.S. in 1951 
						and became influential during the 1960s. Hesse dedicated Siddhartha to his wife Ninon and supposedly 
						afterwards to Romain Rolland and Wilhelm Gundert. The word Siddhartha is made up of two words in the 
						Sanskrit language, siddha + artha, which together means he who has found meaning",
						:background_color => "#55504C"},
					:category => {:name => "Feeling Philosophical", 
								:url => "javascript:void(0);", 
								:background_color => "#fbaf5d",
								:description => ""},
					:id => 4)


				test_book5 = test_book.merge(
					:book_thumb => {
						:book_cover_url => "assets/books/24.jpg",
						:description => "Psychiatry is a novel by Hermann Hesse that deals with the spiritual journey of 
						self-discovery of a man named Siddhartha during the time of the Gautama Buddha. The book, Hesse's 
						ninth novel, was written in German, in a simple, lyrical style. It was published in the U.S. in 1951 
						and became influential during the 1960s. Hesse dedicated Siddhartha to his wife Ninon and supposedly 
						afterwards to Romain Rolland and Wilhelm Gundert. The word Siddhartha is made up of two words in the 
						Sanskrit language, siddha + artha, which together means he who has found meaning",
						:background_color => "#586846"},
					:category => {:name => "Feeling Nomadic", 
								:url => "javascript:void(0);", 
								:background_color => "#fbaf5d",
								:description => ""},
					:id => 5)


				count = params[:count]
				books = [test_book1, test_book2, test_book3, test_book4, test_book5]
				render :json => {:recommendations => {:books => books}}, :status => 200
			end
		end
	end
end