class CreateShelfariCategories < ActiveRecord::Migration
  def change
    create_table :shelfari_categories do |t|
    	t.string 	:name
    	t.text		:url
    	t.string    :ancestry
    	t.string    :order
    	t.boolean	:flag


      t.timestamps
    end

    create_table :shelfari_books_categories do |t|
    	t.belongs_to :shelfari_category
    	t.belongs_to :shelfari_book

    	t.timestamps
    end
  end
end
