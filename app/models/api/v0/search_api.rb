module Api
	module V0
		class SearchApi
			def search_book

			end

			def search_author
			end

			def search_reader

			end

			def self.search(q, count, type)
				puts "#{q}, #{count}, #{type}"

				if (type.include? 'BOOK')
					results = GoodReadsBook.where("UPPER(title) LIKE ?", "#{q.upcase}%")
									   	   .select([:id, :author_name])
									   	   .select("title as name")
									       .limit(count)
					tester = {:name => "BOOK:"+q.upcase}
				elsif (type.include? 'AUTHOR') || (type.include? 'READER')
					results = HumanProfile.where("UPPER(name) LIKE ?", "#{q.upcase}%")
									   	  .select([:id, :name])
									      .limit(count)
					tester = {:name => "HUMAN:"+q.upcase}
				elsif (type.include? 'TAG')
					results = GoodReadsGenre.where("UPPER(name) LIKE ?", "#{q.upcase}%")
											.select([:id, :name])
											.limit(count)
					tester = {:name => "TAG:"+q.upcase}
				else
					results = GoodReadsBook.where("UPPER(title) LIKE ?", "#{q.upcase}%")
									   .select([:id, :author_name])
									   .select("title as name")
									   .limit(count)
					tester = {:name => "RD:"+q.upcase}	
				end
				if results.present?
					results.push tester
				else
					results = did_you_mean(q, type)
				end
			end


			private
			def self.did_you_mean(q, type)
				results = [{:name => "No results found."}]
				if((type.include? 'AUTHOR') || (type.include? 'READER'))
					s = SpellingBee.new :source_text => 'authors.txt'
				 	did_you_mean = s.correct q
				 	if did_you_mean[0] != q
				 		did_you_mean = HumanProfile.where("UPPER(name) LIKE ?", "%#{did_you_mean[0].upcase}%")
				 								   .select([:id, :name])
				 								   .limit(1)

				 		results = [{:name =>  "Did you mean? "+did_you_mean[0].name,
									:id => did_you_mean[0].id}]
					end
				elsif type.include? 'TAG'
					s = SpellingBee.new :source_text => 'tags.txt'
					did_you_mean = s.correct q
					if did_you_mean[0] != q
						did_you_mean = GoodReadsGenre.where("UPPER(name) LIKE ?", "%#{did_you_mean[0].upcase}%")
													.select([:id, :name])
													.limit(1)
						results = [{:name =>  "Did you mean? "+did_you_mean[0].name,
									:id => did_you_mean[0].id}]
					end
				else
					s = SpellingBee.new :source_text => 'books.txt'
					did_you_mean = s.correct q
					if did_you_mean[0] != q
						did_you_mean = GoodReadsBook.where("UPPER(title) LIKE ?", "%#{did_you_mean[0].upcase}%")
													.select([:id, :author_name])
													.select("title as name")
													.limit(1)
						results = [{:name =>  "Did you mean? "+did_you_mean[0].name,
									:id => did_you_mean[0].id,
									:author_name => did_you_mean[0].author_name}]
					end
				end

				results
			end

		end
	end
end