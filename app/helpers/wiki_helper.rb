module WikiHelper
	
	def self.fetch_wiki_info community_name
		web_search = GoogleSearchHelper.search community_name
		wiki_info = []

		web_search.each do |result_url|
			if result_url =~ /wikipedia.org/
				if result_url =~ /\/wiki\//
					wiki_info << {:title => result_url.sub(/.*?\/wiki\//, ''), :url => result_url}
				elsif result_url =~ /\/\?title=/
					wiki_info << {:title => result_url.sub(/.*?\/\?title=/, ''), :url => result_url }
				end
			end
		end
		wiki_info
	end

	def self.get_community_with_wiki wiki_title
		clause = " MATCH (community:Community) WHERE community.wiki_url =~ \'.*[/=]" + wiki_title + "\' "\
		" RETURN ID(community) AS id, community.name AS name "
		result = clause.execute
	end

	def self.obtain_wiki_similar_community community_name
		output = {:name => community_name, :url => ""}
		begin
			wiki_info = fetch_wiki_info community_name
			if wiki_info.present?
				output[:url] = wiki_info[0][:url]
				db_result = self.get_community_with_wiki(wiki_info[0][:title])
				if db_result.present?
					output[:name] = db_result[0]["name"]
					if (db_result.length > 1)
						error = " Database has more than 1 community with wiki title: #{wiki_info[0][:title]} whose IDs are :#{db_result.map{|elem| elem["ID"]}}"
						puts error.red
					end
				end
			end
		rescue Exception => e
			puts e.to_s.red
		end
		output
	end

	#tags data is 'output variable of Textparser.get_tags
	def self.remove_duplicates tags_data
		output = []
		sorted_tags = tags_data.sort_by{ |tag| tag['wiki_url']}
		sorted_tags.each do |tag|
			if output.empty? || output[-1]['wiki_url'] != tag['wiki_url']
				output << tag
			else
				output[-1]['relevance'] = [output[-1]['relevance'], tag['relevance']].max
				output[-1]['relevanceOriginal'] = [output[-1]['relevanceOriginal'], tag['relevanceOriginal']].max
			end
		end
		output
	end

	def self.obtain_wiki_similar_communities tags_data
		threads = []
		#output << self.obtain_wiki_similar_community(tags_data[0][:name])
		tags_data.each{ |data| threads << Thread.new(){
			output = self.obtain_wiki_similar_community data['value']
			data['value'] = output[:name]
			data['name'] = output[:name]
			data['wiki_url'] = output[:url]
			}
		}
		threads.each{|thread| thread.join}
		tags_data = self.remove_duplicates tags_data
		tags_data
	end
end
