class CreateBookCovers < ActiveRecord::Migration
  def change
    create_table :book_covers do |t|
    	t.string :small
    	t.string :medium
    	t.string :large
    	t.integer :book_id

      t.timestamps
    end
  end
end
