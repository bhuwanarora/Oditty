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
					results = GoodReadsBook.where("UPPER(title) LIKE ?", "%#{q.upcase}%")
									   	   .select([:id, :author_name])
									   	   .select("title as name")
									       .limit(count)
					tester = {:name => "BOOK:"+q.upcase}
				elsif (type.include? 'AUTHOR') || (type.include? 'READER')
					results = HumanProfile.where("UPPER(name) LIKE ?", "%#{q.upcase}%")
									   	  .select([:id, :name])
									      .limit(count)
					tester = {:name => "HUMAN:"+q.upcase}
				elsif (type.include? 'TAG')
					results = GoodReadsGenre.where("UPPER(name) LIKE ?", "%#{q.upcase}%")
											.select([:id, :name])
											.limit(count)
					tester = {:name => "TAG:"+q.upcase}
				else
					results = GoodReadsBook.where("UPPER(title) LIKE ?", "%#{q.upcase}%")
									   .select([:id, :author_name])
									   .select("title as name")
									   .limit(count)
					tester = {:name => "RD:"+q.upcase}	
				end
				results.push tester
			end

		end
	end
end