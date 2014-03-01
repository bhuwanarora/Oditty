class FileParserState < ActiveRecord::Base
	attr_accessible :line_number, :status, :object_type, :data, :data_flag
end
