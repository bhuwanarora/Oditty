Neography.configure do |config|
  config.protocol             = "http://"
  config.server               = "localhost"
  config.port                 = 8000
  config.directory            = ""  # prefix this path with '/'
  config.cypher_path          = "/cypher"
  config.gremlin_path         = "/ext/GremlinPlugin/graphdb/execute_script"
  config.log_file             = "neography.log"
  config.log_enabled          = false
  config.slow_log_threshold   = 0    # time in ms for query logging
  config.max_threads          = 20
  config.authentication       = nil  # 'basic' or 'digest'
  config.username             = nil
  config.password             = nil
  config.parser               = MultiJsonParser
  # config.http_send_timeout    = 1200
  # config.http_receive_timeout = 1200
end

module Neography
    class Rest 
        module Cypher
            alias_method :old_execute_query, :execute_query            
            def execute_query(query, parameters = {}, cypher_options = nil)
                response = []
                puts query.print.blue.on_red
                neo_response = old_execute_query(query, parameters, cypher_options)
                neo_response["data"].each do |record|
                    response << Hash[neo_response["columns"].zip(record)]
                end
              response
            end
        end
    end
end
