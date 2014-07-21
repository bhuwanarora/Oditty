module Sexp
	class Expression < Treetop::Runtime::SyntaxNode
		def to_cypher
			cypher_hash =  self.elements[0].to_cypher
			cypher_string = ""
			cypher_string << "START "   + cypher_hash[:start].uniq.join(", ")
			cypher_string << " MATCH "  + cypher_hash[:match].uniq.join(", ") unless cypher_hash[:match].empty?
			cypher_string << " RETURN DISTINCT " + cypher_hash[:return].uniq.join(", ")
			params = cypher_hash[:params].empty? ? {} : cypher_hash[:params].uniq.inject {|a,h| a.merge(h)}
			return [cypher_string, params].compact
		end
	end

	class Body < Treetop::Runtime::SyntaxNode
		def to_cypher
			cypher_hash = Hash.new{|h, k| h[k] = []}
			self.elements.each do |x|
				x.to_cypher.each do |k,v|
					cypher_hash[k] << v
				end
			end
			return cypher_hash
		end
	end

	class MeExpressions < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:start => "me = node({me})", 
		        :return => "me",
		        :params => {"me" => nil }}
		end
	end

	class FriendsExpressions < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:start => "me = node({me})", 
		        :return => "me",
		        :params => {"me" => nil }}
		end 
	end

	class BooksExpressions < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:start => "me = node({me})", 
		        :return => "me",
		        :params => {"me" => nil }}
		end 
	end

	class AuthorsExpressions < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:start => "me = node({me})", 
		        :return => "me",
		        :params => {"me" => nil }}
		end 
	end

	class PopularExpressions < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:start => "me = node({me})", 
		        :return => "me",
		        :params => {"me" => nil }}
		end 
	end

	class OtherExpressions < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:start => "me = node({me})", 
		        :return => "me",
		        :params => {"me" => nil }}
		end 
	end

	class Me < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:start => "me = node({me})", 
		        :return => "me",
		        :params => {"me" => nil }}
		end 
	end

	class Friends < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:start  => "me = node({me})", 
		        :match  => "me -[:friends]-> people",
		        :return => "people",
		        :params => {"me" => nil }}
		end 
	end

	class Books < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:start  => "me = node({me})", 
		        :match  => "me -[:friends]-> people",
		        :return => "people",
		        :params => {"me" => nil }}
		end 
	end

	class Likes < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class Reading < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class Own < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class Need < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class Read < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class Bookmarked < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class Follow < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:start => "place = node:places({place})",
		        :match => "people -[:lives]-> place",
		        :params => {"place" => "name: " + self.text_value.split("in").last.to_s.strip + "*" } }
		end 
	end

	class Lives < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:start => "place = node:places({place})",
		        :match => "people -[:lives]-> place",
		        :params => {"place" => "name: " + self.text_value.split("in").last.to_s.strip + "*" } }
		end 
	end

	class Recommended < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class By < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class PublishedIn < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class PublishedToday < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class PublishedBetween < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class PublishedInCountry < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class Tagged < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class IOwn < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class IHaveRead < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class IHaveRated < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class IHaveDiscussed < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class Discussed < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class Reviewed < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class ReadBy < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class BookmarkedBy < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class PublishedThisYear < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:match => "people -[:likes]-> thing"}
		end 
	end

	class Thing < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {:start  => "thing = node:things({thing})",
		        :params => {"thing" => "name: " + self.text_value } }
		end 
	end

	class People < Treetop::Runtime::SyntaxNode
		def to_cypher
			return {#:start => "people = node:people(\"name:*\")",
		        :return => "people"}
		end 
	end
end