module WikiHelper
	
	def self.get_community_with_wiki wiki_title
		clause = " MATCH (community:Community) WHERE community.wiki_url =~ \'.*[/=]" + wiki_title.gsub("'","\\\\'").gsub('"','\\\\"') + "\' "\
		" RETURN ID(community) AS id, community.name AS name "
		result = clause.execute
	end

	def self.obtain_wiki_similar_community community_name
		output = {:name => community_name, :fromdb => false, :wiki_url => ""}
		begin
			wiki_info = GoogleSearchHelper.fetch_wiki_info community_name
			if wiki_info.present?
				if wiki_info[:url].present?
					output[:wiki_url] = wiki_info[:url]
				end
				if wiki_info[:fb_url].present?
					output[:fb_url] = wiki_info[:fb_url]
				end
				if wiki_info[:twitter_url].present?
					output[:twitter_url] = wiki_info[:twitter_url]
				end
				db_result = self.get_community_with_wiki(wiki_info[:title])
				if db_result.present?
					output[:fromdb] = true
					output[:name] = db_result[0]["name"]
					output[:id] = db_result[0]["id"]
					if (db_result.length > 1)
						error = " Database has more than 1 community with wiki title: #{wiki_info[0][:title]} whose IDs are :#{db_result.map{|elem| elem["id"]}}"
						puts error.red
						puts " Merging these communities communities ".green
						SuperCommunitiesHelper.merge_multiple_communities db_result
						output = {}
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
		sorted_tags = tags_data.sort_by{ |tag| tag['url_list']['wiki_url']}
		sorted_tags.each do |tag|
			if output.empty? || output[-1]['url_list']['wiki_url'] != tag['url_list']['wiki_url']
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
		tags_data.each{ |data| threads << Thread.new(){
			output = self.obtain_wiki_similar_community data['value']
			data['value'] = output[:name]
			data['name'] = output[:name]
			data['url_list'] = {'wiki_url' => output[:wiki_url]}
			if output[:fb_url].present?
				data['url_list']['fb_url'] = output[:fb_url]
			end
			if output[:twitter_url].present?
				data['url_list']['twitter_url'] = output[:twitter_url]
			end
			}
		}
		threads.each{|thread| thread.join}
		tags_data = self.remove_duplicates tags_data
		tags_data
	end
end
