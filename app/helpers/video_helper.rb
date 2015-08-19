module VideoHelper < GenericHelper

	def self.set_up_redis label, key = 'video_duplicate_links_removal'
		super label, key
	end

	def self.correct_link_has_video params
		clause = ''\
				' MATCH (c:Community)<-[hasvideo:HasVideo]-(video:Video) '\
				' MERGE (c)-[hasvideonew:HasVideo]->(video) '\
				' ON CREATE SET hasvideonew.rank = hasvideo.rank '\
				' ON MATCH SET hasvideonew.rank = COALESCE(hasvideonew.rank, hasvideo.rank) '\
				' RETURN MAX(ID(c)) AS id '
	end

	def self.repair_video_links_to_community
		params = {
			:class 			=> VideoHelper,
			:label 			=> 'Community',
			:function 		=> VideoHelper.correct_link_has_video,
			:step_size 		=> 1
		}
		GraphHelper.iterative_entity_operations params
	end
end