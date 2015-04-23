namespace :get_media do

  desc "Get News"
  task :news => :environment do
    puts "init"
    News.handle
  end

  task :blog => :environment do
    puts "init"
    Blog.handle
  end
  task :test => :environment do
    puts "Started"
  end
end