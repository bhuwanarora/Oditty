class CreatePublishers < ActiveRecord::Migration
  def change
    create_table :publishers do |t|
    	t.string :name
    	t.string :url
    	t.integer :publishing_details_id

      t.timestamps
    end
  end
end
