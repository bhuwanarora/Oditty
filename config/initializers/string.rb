class String
    def execute
        neo = Neography::Rest.new
        neo.execute_query self
    end

    def search_ready
    	self.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "").gsub("\\", "").gsub("@", "") rescue ""
    end
end