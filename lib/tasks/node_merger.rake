namespace :merge do
	desc "merge common communities and genres"
	task :merge_common_genre_community => :environment do
		GenreHelper.merge_with_community
	end

	desc "remove duplicate elements. Please set appropriate entry for concerned label before"
    task :merge_duplicate_nodes, [:label,:step] => :environment do |t,args|
      include GenericHelper::MergeNodes
      GenericHelper::MergeNodes.merge args
    end
	
end