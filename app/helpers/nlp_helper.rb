module NLPHelper
	NLPNameTags = {"person" => "Person", "location" => "Location", "organization" => "Organization"}
	#Treat.libraries.stanford.jar_path = '/usr/local/lib/ruby/gems/2.0.0/gems/stanford-core-nlp-0.5.1'
	def self.get_name_tags sentence_string
		require 'treat'
		extend Treat::Core::DSL
		name_tag_list = []
		sent = sentence sentence_string
		sent.apply(:chunk, :segment, :tokenize, :name_tag)
		sent.words.each do |word|
			NLPNameTags.each do |category,label|
				if word[:name_tag].to_s == category
					name_tag_list << label
				end
			end
		end
		name_tag_list.uniq{|category| category}
	end
end