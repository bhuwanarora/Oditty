set :output, "log/cron.log"
# env :PATH, ENV['PATH']

every 1.hour do
  runner "News.handle"
end

every 1.day, :at => '6:05 pm' do
  runner "Blog.handle"
end

every 1.minute, :at => '6:05 pm' do
  runner "echo Hey"
end
