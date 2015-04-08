class Bookmark::Node < Bookmark
	include AbstractInterface

	def self.match 
		Bookmark::Node.api_not_implemented(self)
	end

	def self.get_public
		Bookmark::Node.api_not_implemented(self)
	end

	def self.match_path
		Bookmark::Node.api_not_implemented(self)
	end

	def self.basic_info
		Bookmark::Node.api_not_implemented(self)
	end
end