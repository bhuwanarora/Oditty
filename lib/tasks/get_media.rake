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

    desc "Get Literature news"
    task :old_lit_news => :environment do
        puts "init"
        include NewsHelper
        NewsHelper.insert_old_lit_news
    end

end