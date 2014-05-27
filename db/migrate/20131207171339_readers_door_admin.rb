class ReadersDoorAdmin < ActiveRecord::Migration
  def change
  	create_table :readers_door_admins do |t|
  		t.string :name
  		t.string :email

  		t.timestamps
  	end
  end
end
