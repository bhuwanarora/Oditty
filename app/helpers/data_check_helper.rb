module DataCheckHelper

	def self.relabel_null_book_title
		min = 384293
		max = 5797189
		skip = 1000
		count = min
		while count < max
			puts "execute... #{count}"
			clause = "MATCH (b:Book) WHERE b.title IS NULL AND ID(b) >= "+count.to_s+" AND ID(b) < "+(count+skip).to_s+" REMOVE b:Book SET b:HiddenBook"
			count = count + skip
			clause.execute
		end
	end

	def self.invert_wrong_belongs_to_links
		min = 384296
		max = 4830210
		skip = 1000
		count = min
		while count < max
			puts "execute... #{count}"
			clause = "MATCH (g:Genre) "\
			" WHERE ID(g) >= "+count.to_s+" AND ID(g) < "+(count+skip).to_s+" WITH g "\
			" MATCH (g)<-[r1:Belongs_to]-(b:Book) "\
			" CREATE UNIQUE (g)-[r2:Belongs_to]->(b) "\
			" SET r2.weight = r1.weight "\
			" DELETE r1 "
			clause.execute
		end
	end

end