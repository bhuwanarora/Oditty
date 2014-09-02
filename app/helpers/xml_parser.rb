module XmlParser
	def self.parse
		test = ""
		target = open('neo4j/out.graphml', 'w')
		File.open('neo4j/out.graphml', 'r') do |f1| 
			while line = f1.gets
				puts line
			end
		open(name, 'wb') do |file|
			file << open(Rails.root.join("neo4j/out.graphml")).read
		end
	end
end