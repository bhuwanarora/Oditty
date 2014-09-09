# Use this file to easily define all of your cron jobs.
#
# It's helpful, but not entirely necessary to understand cron before proceeding.
# http://en.wikipedia.org/wiki/Cron

# Example:
#
set :output, "../dev/log/cron.log"
#
# every 2.hours do
#   command "/usr/bin/some_great_command"
#   runner "MyModel.some_method"
#   rake "some:great:rake:task"
# end
#
every 1.day, :at => '11:10 pm' do
  runner "TrendsHelper.social_mention"
end

every 1.second do
	puts "schedule.rb"
end

# Learn more: http://github.com/javan/whenever
