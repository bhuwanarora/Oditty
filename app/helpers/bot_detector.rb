module BotDetector
	def self.detect user_agent
		is_bot = false
		Constant::Bot::BotsList.each do |bot_name|
			is_bot = (is_bot||(user_agent.include? bot_name)) 
		end
		is_bot
	end
end