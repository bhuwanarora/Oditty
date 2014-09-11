# set :output, "../dev/log/cron.log"

every 1.day, :at => '3:20pm'  do
  runner "TrendsHelper.social_mention"
end
