set :output, "log/cron.log"

every 1.day, :at => '1:05 pm' do
  runner "News.create"
end
