namespace :images do

  desc "set_genre_images"
  task :set_genre_images => :environment do
    include ImagesHelper
    ImagesHelper.set_genre_images
  end

  desc "set community images"
  task :set_community_image_version => :environment do
    include ImagesHelper
    ImagesHelper.set_community_image_version
  end  

  desc "set user images"
  task :set_user_image_version => :environment do
    include ImagesHelper
    ImagesHelper.set_user_image_version
  end  
  
  desc "set news images"
  task :set_news_image_version => :environment do
    include ImagesHelper
    ImagesHelper.set_news_image_version
  end  

end

