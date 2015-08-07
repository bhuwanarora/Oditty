namespace :get_media do

    desc "Get News"
    task :news => :environment do
        puts "init"
        include NewsHelper
        NewsHelper.insert_news
    end

    desc "Get Blog"
    task :blog => :environment do
        puts "init blog service"
        include BlogsHelper
        BlogsHelper.handle
    end

    def "Get Literature news"
    ask :news => :environment do
        puts "init"
        include NewsHelper
        NewsHelper.insert_old_news
    end

end