class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
    	t.string :uuid
    	t.string :salt
    	t.string :name
    	t.string :description

      t.timestamps
    end

    create_table :books_tags do |t|
    	t.belongs_to :book
    	t.belongs_to :tag


      t.timestamps
    end
  end
end
