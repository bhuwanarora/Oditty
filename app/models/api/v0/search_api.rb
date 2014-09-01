module Api
	module V0
		class SearchApi
			def self.search_books(q, user_id=nil)
				results = []
				neo_init
				q = q.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "").gsub("\\", "")
				unless user_id.present?
					clause = "START book=node:node_auto_index('indexed_title:"+q+"*') WITH book RETURN book.isbn, ID(book), book.title as name, book.author_name ORDER BY book.total_weight DESC LIMIT 10"
				else
					clause = "START book=node:node_auto_index('indexed_title:"+q+"*') WITH book ORDER BY book.total_weight DESC OPTIONAL MATCH (book)<-[:MarkAsRead]-(:MarkAsReadNode)<-[m:MarkAsReadAction]-(user:User) WHERE ID(user)="+user_id.to_s+" RETURN book.isbn, ID(book), book.title as name, book.author_name, ID(m) LIMIT 10"
				end
				puts clause.blue.on_red
				if q.length >= 3
					results = @neo.execute_query(clause)["data"]
				end
				results
			end

			def self.search_genres(q, limit)
				results = []
				neo_init
				q = q.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "").gsub("\\", "") rescue ""
				if q.present?
					clause = "START genre=node:node_auto_index('indexed_star_genre_name:"+q+"*') RETURN genre.name, ID(genre) ORDER BY genre.books_count DESC LIMIT "+limit.to_s
				else
					clause = "MATCH(genre:Genre) WHERE genre.root_genre=true RETURN genre.name, ID(genre), genre.icon ORDER BY genre.books_count DESC"
				end
				puts clause.blue.on_red
				results = @neo.execute_query(clause)["data"]
				results
			end

			def self.search_authors(q, user_id, genre_id)
				results = []
				neo_init
				q = q.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "").gsub("\\", "")
				if genre_id.present? && genre_id != "0"
					if q.present?
						clause = "START author=node:node_auto_index('indexed_main_author_name:"+q+"*') RETURN author.name, ID(author) LIMIT 10"
						results = @neo.execute_query(clause)["data"]
					else
						clause = "MATCH (g:Genre)-[:Belongs_to]->(:Book)<-[:Wrote]-(author:Author) WHERE ID(g)="+genre_id.to_s+" WITH DISTINCT author as author RETURN author.name, ID(author) LIMIT 10"
						results = @neo.execute_query(clause)["data"]
					end
				else
					if q.present?
						clause = "START author=node:node_auto_index('indexed_main_author_name:"+q+"*') RETURN author.name, ID(author) LIMIT 10"
						results = @neo.execute_query(clause)["data"]
					else
						clause = "MATCH (author:Author) RETURN author.name, ID(author) LIMIT 10"
						results = @neo.execute_query(clause)["data"]
					end
				end
				puts clause.blue.on_red
				results
			end

			def search_reader

			end

			def self.search(q, count, type)
				neo_init
				q = q.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "").gsub("\\", "").gsub("@", "")
				if (type.include? 'BOOK')
					clause = "START book=node:node_auto_index('indexed_title:"+q+"*') RETURN book.title as name, book.author_name, ID(book) ORDER by book.weight DESC LIMIT "+count.to_s
					puts clause.blue.on_red
					
				elsif type.include? 'AUTHOR'
					clause = "START author=node:node_auto_index('indexed_main_author_name:"+q+"*') RETURN DISTINCT author.name as name, ID(author) LIMIT "+count.to_s
					puts clause.blue.on_red
				elsif type.include? 'READER'
					clause = "START user=node:node_auto_index('indexed_user_name:"+q+"*') RETURN DISTINCT user.name as name, ID(user) LIMIT "+count.to_s
					puts clause.blue.on_red
				elsif type.include? 'TAG'
					clause = "START genre=node:node_auto_index('indexed_genre_name:"+q+"*') RETURN genre.name as name, ID(genre) LIMIT "+count.to_s
					puts clause.blue.on_red
					
				else
					clause = "START search_node=node:node_auto_index('search_index:"+q+"*') RETURN CASE WHEN search_node.title IS NULL THEN search_node.name ELSE search_node.title END, search_node.author_name, ID(search_node), labels(search_node) LIMIT "+count.to_s
					puts clause.blue.on_red
					
				end
				results = @neo.execute_query clause
				if results.present?
					results
					# results.push tester
				else
					results = []
					# results = did_you_mean(q, type)
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

			private
			def self.neo_init
                @neo = Neography::Rest.new
            end

		end
	end
end