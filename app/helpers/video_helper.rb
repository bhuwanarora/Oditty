module VideoHelper
	def self.set_up_redis label, key = 'video_duplicate_links_removal'
		GenricHelper.set_up_redis label, key
	end

	Correct_link_has_video = Proc.new do |params|
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
			:function 		=> VideoHelper::Correct_link_has_video,
			:step_size 		=> 1
		}
		GraphHelper.iterative_entity_operations params
	end

end