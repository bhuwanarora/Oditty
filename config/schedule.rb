set :output, "../dev/log/cron.log"

every 1.minute do
  runner "TrendsHelper.social_mention"
end
