class CreateShelfariTags < ActiveRecord::Migration
  def change
    create_table :shelfari_tags do |t|
    	t.string 		:name
    	t.text			:url
    	t.boolean		:flag

      	t.timestamps
    end

    create_table :shelfari_books_tags do |t|
    	t.belongs_to	:shelfari_tag
    	t.belongs_to	:shelfari_book
    	t.string		:weight

    	t.timestamps
    end
  end
end
