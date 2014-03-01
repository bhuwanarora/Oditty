class CreateAuthors < ActiveRecord::Migration
  def change
    create_table :authors do |t|
    	t.integer :human_profile_id

      t.timestamps
    end
  end
end
