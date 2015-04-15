set :output, "log/cron.log"

every 1.day, :at => '1:05 pm' do
  runner "News.handle"
end

every 1.day, :at => '6:05 pm' do
  runner "Blog.handle"
end
