class Video < Neo
	def initialize

	end

	def self.basic_info
		" video.title AS title, video.url AS url, video.publisher AS publisher, video.thumbnail AS thumbnail, video.duration AS duration, video.published_date AS published_date "
	end
end