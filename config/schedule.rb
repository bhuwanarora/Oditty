set :output, "log/cron.log"
env :PATH, ENV['PATH']
# env :GEM_PATH, ENV['GEM_PATH']
every 1.hour do
  runner "News.handle"
end

every 1.day, :at => '6:05 pm' do
  runner "Blog.handle"
end

every 1.minute  do
  runner "echo Hey"
end
