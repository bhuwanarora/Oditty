namespace :get_media do

    desc "Get News"
    task :news => :environment do
        puts "init"
        include NewsHelper
        NewsHelper.handle
    end

    desc "Get Blog"
    task :blog => :environment do
        puts "init blog service"
        include BlogsHelper
        BlogsHelper.handle
    end

end