class Video < Neo
	def initialize id
		@id = id
	end

	def self.match_community
		" MATCH (video:Video)-[has_video:HasVideo]->(community:Community) WITH video, community "
	end

	def self.match
		" MATCH (video:Video) WHERE ID(video) = " + @id.to_s + " WITH video "
	end

	def self.basic_info
		" video.title AS title, video.url AS url, video.publisher AS publisher, video.thumbnail AS thumbnail, video.duration AS duration, video.published_date AS published_date "
	end

	def self.merge_community google_rank = -1
		clause = " MERGE (video)-[has_video:HasVideo]->(community) "
		if google_rank.present? && google_rank > 0
			clause += " SET has_video.rank = " + google_rank.to_s + " "
		end
		clause += " WITH video, community, has_video "
	end

	def self.merge video
		" MERGE (video:Video{url:\'" + video[:url] + "\'}) "\
			" ON CREATE SET "\
			" video.title = \'" + video[:title].escape_quotes + "\', "\
			" video.thumbnail = \'" + video[:thumbnail].to_s + "\', "\
			" video.duration = " + video[:duration].to_s + ", "\
			" video.publisher = \'" + video[:publisher].to_s + "\', "\
			" video.published_date = \'" + video[:published_date].to_s + "\' "\
		" WITH video "
	end
end