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
								.order("priority DESC")
								.select("id, name, priority")
								.as_json
				filter_author = Filter.where(:filter_type => "AUTHOR")
								.order(:priority)
								.select("id, name, priority")
								.as_json
				filter_reader = Filter.where(:filter_type => "READER")
								.order(:priority)
								.select("id, name, priority")
								.as_json
				render :json => {:filters => {
									"book" => filters_book, 
									"author" => filter_author,
									"reader" => filter_reader
								}}, :status => 200
			end

			def push_recommendations
				test_book = BookApi.push_recommendations
				render :json => {:recommendations => {:books => [test_book]}}, :status => 200
			end

			def recommendations
				filter_type = (JSON.parse params[:q])["filter_type"]
				filters = JSON.parse(params[:q])["more_filters"]
				if filter_type == "BOOK"
					books = BookApi.recommendations
					recommendations =  {:books => books}
				elsif filter_type == "AUTHOR"
					authors = AuthorApi.recommendations
					recommendations = {:authors => authors}
				elsif filter_type == "READER"
					readers = ReaderApi.recommendations
					recommendations = {:readers => readers}
				else
					books = BookApi.recommendations
					recommendations =  {:books => books}
				end
				render :json => {:recommendations => recommendations}, :status => 200
			end
		end
	end
end