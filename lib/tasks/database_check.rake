namespace :data_check do

  	desc "relabel_null_book_title"
  	task :relabel_null_book_title => :environment do
    	include DataCheckHelper
    	DataCheckHelper.relabel_null_book_title
  	end

  	desc "invert_wrong_belongs_to_links"
  	task :invert_wrong_belongs_to_links => :environment do
  		include DataCheckHelper
  		DataCheckHelper.invert_wrong_belongs_to_links
  	end

    desc "remove duplicate elements. Please set appropriate entry for concerned label before"
    task :merge_duplicate_nodes, [:label,:step] => :environment do |t,args|
      include GenericHelper::MergeNodes
      GenericHelper::MergeNodes.merge(args[:label], args[:step])
    end

end