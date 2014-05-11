class CreateBookPublishingDetails < ActiveRecord::Migration
  def change
    create_table :book_publishing_details do |t|
    	t.string :date
    	t.integer :book_id

      t.timestamps
    end

  end
end
