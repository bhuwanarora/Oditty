class CreateSearchPages < ActiveRecord::Migration
  def change
    create_table :search_pages do |t|
    	t.text :background_image_url

      t.timestamps
    end
  end
end
