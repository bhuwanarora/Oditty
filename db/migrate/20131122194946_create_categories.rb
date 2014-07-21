class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
    	t.string :uuid
    	t.string :salt
    	t.string :name

      t.timestamps
    end

    add_index :categories, :name
  end
end
