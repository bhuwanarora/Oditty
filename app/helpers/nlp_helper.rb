module NLPHelper
	require 'treat'
	include Treat::Core::DSL
	NLPNameTags = {"person" => "Person", "location" => "Location", "organization" => "Organization"}
	
	def self.get_name_tags sentence_string
		debugger
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