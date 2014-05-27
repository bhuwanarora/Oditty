class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
    	t.integer :human_profile_id

      t.timestamps
    end
  end
end
