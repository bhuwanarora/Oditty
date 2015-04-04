class String
    def execute
        neo = Neography::Rest.new
        neo.execute_query self
    end

    def search_ready
    	self.downcase.gsub(" ", "").gsub(":", "").gsub("'", "").gsub("!", "").gsub("[", "").gsub("[", "").gsub("\\", "").gsub("@", "") rescue ""
    end

    def print
    	self.gsub("CREATE", "\n CREATE")
    		.gsub("MERGE", "\n MERGE")
    		.gsub("WITH", "\n WITH")
    		.gsub("WHERE", "\n WHERE")
    		.gsub("FOREACH", "\n FOREACH")
    		.gsub("DELETE", "\n DELETE")
    		.gsub("OPTIONAL", "\n OPTIONAL")
            .gsub("RETURN", "\n RETURN")
            .gsub("ORDER", "\n ORDER")
            .gsub("LIMIT", "\n LIMIT")
            .gsub("SET", "\n SET")
    end
end