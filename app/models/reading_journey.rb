class ReadingJourney < Neo
	def initialize user_id, book_id
		@user_id = user_id
		@book_id = book_id
		@user = User.new(user_id)
		@book = Book.new(book_id)
	end

	def self.create
		" CREATE UNIQUE (user)-[:HasReadingJourney]->(reading_journey:ReadingJourney)-[:ForBook]->(book) CREATE UNIQUE (reading_journey)-[:NextStatus]->(reading_journey) "
	end

	def self.match_facebook_book
		" MATCH (user)-[:HasReadingJourney]-(reading_journey:ReadingJourney)-[:ForBook]-(book:FacebookBook) "
	end

	def self.link_reading_journey user_id
		User.new(user_id).match + ", book " + ReadingJourney.merge + ReadingJourney.optional_match_recent_reading_status 
	end

	def self.create_progress reading_journey_info, progress
		clause = ""
		nodes = []
		if progress.present?
			progress = progress.sort_by{ |a| a["percent_complete"] }
			progress.each_with_index do |step, index|
				if (step["timestamp"].to_i > reading_journey_info['timestamp'].to_i)
					nodes << "node#{index}"
					clause += " CREATE (node#{index}: Progress {percentage: " + step['percent_complete'].to_s + ", created_at: " + step['timestamp'].to_s + " timestamp: " + Time.now.to_i.to_s + "}) "
					if index > 0
						clause += " MERGE (node#{index})-[:NextStatus]->(#{nodes[-2]}) "
					end
					clause += " WITH " + nodes.join(", ")
				end
			end
			if nodes.present?
				clause += ReadingJourney.match_reading_journey_id(reading_journey_info['id']) + ", " + nodes.join(", ") + " DELETE next_status MERGE (#{nodes.first})-[:NextStatus]->(recent_status) MERGE (reading_journey)-[:NextStatus]->(#{nodes.last}) " + ReadingJourney.return_group("ID(reading_journey) AS id")
			end
		end
		clause 
	end

	def self.match_reading_journey_id id
		" MATCH (reading_journey)-[next_status:NextStatus]->(recent_status) WHERE ID(reading_journey) = " + id.to_s + " WITH reading_journey, recent_status, next_status "
	end

	def self.merge
		" MERGE (user)-[has_reading_journey:HasReadingJourney]->(reading_journey:ReadingJourney)-[for_book:ForBook]->(book) WITH user, book, reading_journey "
	end

	def self.optional_match_recent_reading_status
		 " OPTIONAL MATCH (reading_journey)-[next_status:NextStatus]->(recent_status)  FOREACH (ignore IN CASE WHEN next_status IS NULL THEN [1] ELSE [] END | MERGE (reading_journey)-[next_status:NextStatus]->(reading_journey) ON CREATE SET reading_journey.timestamp = 0) WITH user, book, reading_journey, recent_status "
	end

	def self.set_start_time start_time
		" SET reading_journey.start_time = " + start_time.to_i.to_s
	end

	def self.set_publish_time publish_time
		" SET reading_journey.publish_time = " + publish_time.to_i.to_s
	end
end