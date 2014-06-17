namespace :trends do

  desc "trends from socialmention.com"
  task :social_mention => :environment do
    puts "init"
    include TrendsHelper
    TrendsHelper.social_mention
  end
  
end