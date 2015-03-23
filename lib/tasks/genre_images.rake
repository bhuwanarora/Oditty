namespace :images do

  desc "set_genre_images"
  task :set_genre_images => :environment do
    include ImagesHelper
    ImagesHelper.set_genre_images
  end
end

