class MoviesController < ApplicationController
	def index
	    neo = Neography::Rest.new

	    clause = "MATCH (m:Movie)<-[:MovieBased]-(b:Book) RETURN ID(m), m.name, m.year, m.imdb_url, COUNT(b)"
	    puts clause.blue.on_red
	    @movies = neo.execute_query(clause)["data"]
	end
end
