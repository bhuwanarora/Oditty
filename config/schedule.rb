job_type :cronner, "cd :path && bundle exec rails runner -e :environment ':task' :output"
set :output, "log/cron.log"
env :PATH, ENV['PATH']
env :GEM_PATH, " /home/ubuntu/.rbenv/versions/2.0.0-p598/lib/ruby/gems/2.0.0"

every 1.hour do
  runner "News.handle"
end

every 1.day, :at => '6:05 pm' do
  runner "Blog.handle"
end

every 1.minute  do
  cronner " TesterHelper.outs "
end

every 1.minute  do
  runner " TesterHelper.outs "
end
