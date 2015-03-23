class String
    def execute
        neo = Neography::Rest.new
        neo.execute_query self
    end
end