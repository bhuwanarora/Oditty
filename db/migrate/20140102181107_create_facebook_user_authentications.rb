class CreateFacebookUserAuthentications < ActiveRecord::Migration
  def change
    create_table :facebook_user_authentications do |t|
    	t.text	:link	
    	t.string :first_name
    	t.string :last_name
    	t.string :gender
    	t.string :uid
    	t.string :locale
    	t.string :location_id
    	t.text 	 :location_name
    	t.string :username
    	t.text	 :oauth_token
    	t.integer :user_id

      t.timestamps
    end
  end
end
