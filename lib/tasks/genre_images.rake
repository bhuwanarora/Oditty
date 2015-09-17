namespace :images do

  desc "set_genre_images"
  task :set_genre_images => :environment do
    include ImagesHelper
    ImagesHelper.set_genre_images
  end

  desc "set redis values"
  task :reset_redis_values => :environment do
    include ImagesHelper
    ImagesHelper.reset_redis_values
  end

  desc "set community images"
  task :set_community_image_version => :environment do
    include ImagesHelper
    CommunititesHelper.add_images_to_S3
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