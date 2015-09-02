module GenericHelper
	#TerminationString = "You have reached end of your process :). Good Bye !! "
	def self.set_up_redis label, key
		(max_id,min_id) = Neo.get_max_min_id label
		cur_id = RedisHelper.set_up_redis key, min_id
		{:cur_id => cur_id, :max_id => max_id}
	end

	def self.set_up_redis_by_name key, init_depth = 3
		init_string = Array.new(init_depth) { 'a' }.join
		output = RedisHelper.set_up_redis key, init_string
		output
	end

	def self.update_redis key, value
		RedisHelper.update_value key, value
	end

	def self.get_files_in_directory directory, file_regex = '*'
		Dir[directory + "/" + file_regex]
	end

	def self.recursively_create_directories directory
		require 'fileutils'
		FileUtils.mkdir_p directory
	end

	def self.merge_duplicate_nodes params

	end
end