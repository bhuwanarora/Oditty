class SummaryWorker
	require 'wikipedia'
	
	@queue = :summary
	def self.perform(isbn, id, title)
		begin
			@neo ||= self.neo_init
			puts "summary #{isbn}, #{id}, #{title}".green
			for i in isbn.split(",") do
				self.get_summary_from_ol(i, id)
			end
			self.get_summary_from_wiki(title, id)
			clause = "MATCH (b:Book) WHERE ID(b)="+id.to_s+" SET b.linked=true"
			@neo.execute_query(clause)
		rescue Exception => e
			puts e.to_s.red
		end
	end


	private
	def self.neo_init
		@neo = Neography::Rest.new
	end

	def self.get_summary_from_ol(isbn, id)
		puts "get_summary_from_ol #{id}".green
		url = 'https://openlibrary.org/api/books?bibkeys=ISBN:'+isbn+'&format=json&jscmd=data'
		response = Net::HTTP.get(URI.parse(url))
		response = JSON.parse response
		summary = response["description"]
		if summary.present?
			@neo ||= self.neo_init
			clause = "MATCH (b:Book) WHERE ID(b)="+id.to_s+" CREATE UNIQUE (b)-[:OpenLibraryInfo]->(ol:OpenLibrary) SET ol.summary=\""+summary+"\" ol.isbn="+isbn.to_s
			puts clause.blue.on_red
			@neo.execute_query clause
		end
	end

	def self.get_summary_from_wiki(title, id)
		puts "get_summary_from_wiki #{id}".green
		page = Wikipedia.find(title+" (novel) ")
		categories = page.categories
		if categories.present?
			related_words = ["novels", "books"]
			is_valid = false
			puts categories.to_s.green
			for category in categories
				if (category.include? related_words[0]) || (category.include? related_words[1])
					is_valid = true
				end
			end
			if is_valid
				content = page.content.split("==")
				about = content[0].split("''''")[2]
				plot_head = page.content.split("==")[1].downcase.gsub(" ", "") 
				if plot_head == "plotsummary" || plot_head == "plot"
					plot_summary = page.content.split("==")[2]
				end
				if about.present?
					clause = " w.about=\""+about.gsub("[[","").gsub("]]","").gsub("\"","'")+"\""
				end
				if plot_summary.present?
					if about.present?
						clause = clause + ","
					else
						clause = ""
					end
					clause = clause + " w.plot_summary=\""+plot_summary.gsub("[[","").gsub("]]","").gsub("\"","'")+"\" "
				end

				if clause.present?
					@neo ||= self.neo_init
					clause = "MATCH (b:Book) WHERE ID(b)="+id.to_s+" CREATE UNIQUE (b)-[:WikiInfo]->(w:Wiki) SET "+clause
					puts clause.blue.on_red
					@neo.execute_query clause
				end
			end
		end
	end

end