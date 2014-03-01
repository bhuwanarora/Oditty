class CreateGmailUserAuthentications < ActiveRecord::Migration
  def change
    create_table :gmail_user_authentications do |t|

      t.timestamps
    end
  end
end
