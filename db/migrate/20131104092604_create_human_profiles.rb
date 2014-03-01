class CreateHumanProfiles < ActiveRecord::Migration
  def change
    create_table :human_profiles do |t|
    	t.string  :name
    	t.date    :born_on
    	t.boolean :is_alive
    	t.integer :gender_id
    	t.integer :address_id
    	t.integer :profession_id
      t.string  :openlibrary_url

      t.timestamps
    end
  end
end
