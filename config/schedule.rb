set :output, "../dev/log/cron.log"

every 1.day, :at => '5:25 am'  do
  runner "TrendsHelper.social_mention"
end
