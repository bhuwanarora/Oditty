class String
    def execute
        neo = Neography::Rest.new
        neo.execute_query self
    end

    def search_ready
    	self.downcase
            .gsub(" ", "")
            .gsub(":", "")
            .gsub("'", "")
            .gsub("!", "")
            .gsub("[", "")
            .gsub("]", "")
            .gsub("\\", "")
            .gsub("@", "")
            .gsub("\"","")
            .gsub(".","")
            .gsub("\'","")
            .gsub(",","")
            .gsub("\"","\\\"")
            .gsub("\"",%q(\\\')) rescue ""
    end

	def is_json?
        is_json = false
	    begin
	      	is_json = !!JSON.parse(self)
	    rescue
    	end
        is_json
  	end

    def search_compliant
        self.gsub("book.","node.")
            .gsub("user.","node.")
            .gsub("community.","node.")
            .gsub("news.","node.")
            .gsub("blog.","node.")
            .gsub("category.","node.")
            .gsub("author.","node.")
            .gsub("blog.","node.")
            .gsub("news.","node.")
            .gsub("(book)","(node)")
            .gsub("(author)","(node)")
            .gsub("(category)","(node)")
            .gsub("(user)","(node)")
            .gsub("(blog)","(node)")
            .gsub("(news)","(node)")
            .gsub("(label)", "(node)")
            .gsub("label.", "node.")
            .gsub("(community)","(node)")
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
            .gsub("MATCH", "\n MATCH")
            .gsub("START", "\n START")
    end

    def database_ready
        self.gsub("\\","\\\\")
            .gsub("\"","\\\"")
            .gsub("\"",%q(\\\'))
    end
end