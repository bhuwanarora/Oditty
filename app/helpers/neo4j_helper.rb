module Neo4jHelper
	require 'neography'
	require 'neo4j-cypher'
	require 'neo4j-cypher/neography'

	def self.init
		@neo = Neography::Rest.new
	end

	def self.query query
		Neo4j::Cypher.query{query}.to_s
	end
end