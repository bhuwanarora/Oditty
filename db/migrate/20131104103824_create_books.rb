class CreateBooks < ActiveRecord::Migration
  def change
    create_table :books do |t|
    	t.string 	:name
    	t.integer 	:language_id
    	t.text		:description
    	t.integer	:pages
    	t.datetime	:published_on
    	t.integer	:book_publisher_id
    	t.integer	:book_series_id

      t.timestamps
    end
  end
end
