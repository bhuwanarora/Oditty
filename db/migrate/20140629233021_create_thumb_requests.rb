class CreateThumbRequests < ActiveRecord::Migration
  def change
    create_table :thumb_requests do |t|
    	t.text 		:thumb_url
    	t.string 	:title
    	t.text		:book_url
    	t.string	:username
    	t.text		:user_thumb
    	t.text		:user_link
    	t.boolean	:status

      t.timestamps
    end
  end
end