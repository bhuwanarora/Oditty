set :output, "log/cron.log"
env :PATH, ENV['PATH']
env :GEM_PATH, ENV['GEM_PATH']

every 12.hour do
  rake " get_media:news "
end

every 1.day, :at => '6:05 pm' do
  rake " get_media:blog "
end
