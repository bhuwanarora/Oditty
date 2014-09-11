set :output, "../dev/log/cron.log"

every 1.minute  do
  # runner "TrendsHelper.social_mention"
  runner "SubscriptionMailer.test_email"
end
