class HandleGoogleOAuth < ActiveRecord::Migration
  def change
  	create_table :google_user_authentications do |t|
  		t.integer :user_id
  		t.text		:image_url
  		t.text		:oauth_token 
  		t.string  :first_name
      t.string  :last_name
      t.text    :link
      t.string  :username

  		t.timestamps
  	end

  	add_index :google_user_authentications, :user_id
  	add_index :facebook_user_authentications, :user_id
  	add_index :users, :email
  	add_column :facebook_user_authentications, :image_url, :text
    add_column :facebook_user_authentications, :access_token, :text
  end
end
