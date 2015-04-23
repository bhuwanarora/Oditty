set :output, "log/cron.log"
env :PATH, ENV['PATH']

every 1.hour do
  rake " get_media:news "
end

every 1.day, :at => '6:05 pm' do
  rake " get_media:blog "
end

every 1.minute  do
  rake " get_media:test "
end