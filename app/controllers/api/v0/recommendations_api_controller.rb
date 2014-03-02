module Api
	module V0
		class RecommendationsApiController < ApplicationController
			def books
				books = [
						{:title => "City",
						  :author_name => "P. D. Smith",
						  :tags => [
						  	{:name => "Philosophy", :url => "javascript:void(0);"},
						  	{:name => "Art", :url => "javascript:void(0);"},
						  	{:name => "20th Century", :url => "javascript:void(0);"}
						  ],
						  :book_cover_url => "assets/books/12.jpg",
						  :rating => 4,
						  :status => 0,
						  :readers_count => "112",
						  :discussions_count => "23",
						  :reviews_count => "5",
						  :description => "",
						  :category => "",
						  :news => [{:description => "", :from => ""}]
						  }
						]
				render :json => {:books => books}, :status => 200
			end
		end
	end
end