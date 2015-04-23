namespace :get_media do

  desc "Get News"
  task :news => :environment do
    puts "init"
    include News
    News.handle
  end

  task :blog => :environment do
    puts "init"
    include Blog
    Blog.handle
  end
  task :test => :environment do
    puts "Started"
  end
end