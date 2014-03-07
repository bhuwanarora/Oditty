module Api
	module V0
		class RecommendationsApiController < ApplicationController
			def books
				test_book = {:title => "City",
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
				test_book1 = test_book.merge(:book_thumb => {:book_cover_url => "assets/books/20.jpeg",
					:description => "Psychiatry is a novel by Hermann Hesse that deals with the spiritual journey of self-discovery of a man named Siddhartha during the time of the Gautama Buddha. The book, Hesse's ninth novel, was written in German, in a simple, lyrical style. It was published in the U.S. in 1951 and became influential during the 1960s. Hesse dedicated Siddhartha to his wife Ninon and supposedly afterwards to Romain Rolland and Wilhelm Gundert. The word Siddhartha is made up of two words in the Sanskrit language, siddha + artha, which together means he who has found meaning"},
					:category => {:name => "Must Reads", :url => "javascript:void(0);"},
					:id => 1)


				test_book2 = test_book.merge(:book_thumb => {:book_cover_url => "assets/books/10.jpg",
					:description => "Psychiatry is a novel by Hermann Hesse that deals with the spiritual journey of self-discovery of a man named Siddhartha during the time of the Gautama Buddha. The book, Hesse's ninth novel, was written in German, in a simple, lyrical style. It was published in the U.S. in 1951 and became influential during the 1960s. Hesse dedicated Siddhartha to his wife Ninon and supposedly afterwards to Romain Rolland and Wilhelm Gundert. The word Siddhartha is made up of two words in the Sanskrit language, siddha + artha, which together means he who has found meaning"},
					:category => {:name => "Similar Reads", :url => "javascript:void(0);"},
					:id => 2)


				test_book3 = test_book.merge(:book_thumb => {:book_cover_url => "assets/books/11.jpeg",
					:description => "Psychiatry is a novel by Hermann Hesse that deals with the spiritual journey of self-discovery of a man named Siddhartha during the time of the Gautama Buddha. The book, Hesse's ninth novel, was written in German, in a simple, lyrical style. It was published in the U.S. in 1951 and became influential during the 1960s. Hesse dedicated Siddhartha to his wife Ninon and supposedly afterwards to Romain Rolland and Wilhelm Gundert. The word Siddhartha is made up of two words in the Sanskrit language, siddha + artha, which together means he who has found meaning"},
					:category => {:name => "Recommendation From Abhishek", :url => "javascript:void(0);"},
					:id => 3)


				test_book4 = test_book.merge(:book_thumb => {:book_cover_url => "assets/books/13.jpeg",
					:description => "Psychiatry is a novel by Hermann Hesse that deals with the spiritual journey of self-discovery of a man named Siddhartha during the time of the Gautama Buddha. The book, Hesse's ninth novel, was written in German, in a simple, lyrical style. It was published in the U.S. in 1951 and became influential during the 1960s. Hesse dedicated Siddhartha to his wife Ninon and supposedly afterwards to Romain Rolland and Wilhelm Gundert. The word Siddhartha is made up of two words in the Sanskrit language, siddha + artha, which together means he who has found meaning"},
					:category => {:name => "Feeling Philosophical", :url => "javascript:void(0);"},
					:id => 4)


				test_book5 = test_book.merge(:book_thumb => {:book_cover_url => "assets/books/24.jpg",
					:description => "Psychiatry is a novel by Hermann Hesse that deals with the spiritual journey of self-discovery of a man named Siddhartha during the time of the Gautama Buddha. The book, Hesse's ninth novel, was written in German, in a simple, lyrical style. It was published in the U.S. in 1951 and became influential during the 1960s. Hesse dedicated Siddhartha to his wife Ninon and supposedly afterwards to Romain Rolland and Wilhelm Gundert. The word Siddhartha is made up of two words in the Sanskrit language, siddha + artha, which together means he who has found meaning"},
					:category => {:name => "Feeling Nomadic", :url => "javascript:void(0);"},
					:id => 5)


				count = params[:count]
				books = [test_book1, test_book2, test_book3, test_book4, test_book5]
				render :json => {:books => books}, :status => 200
			end
		end
	end
end