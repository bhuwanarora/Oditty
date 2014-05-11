class CreateMovies < ActiveRecord::Migration
  def change
    create_table :movies do |t|
    	t.string 	:name
    	t.text		:imbd_url
    	t.string	:year

      t.timestamps
    end

    create_table :movies_shelfari_books do |t|
    	t.belongs_to :movie
    	t.belongs_to :shelfari_book

    	t.timestamps
    end

    add_column :shelfari_books, :first_sentence, :text

    create_table :characters do |t|
    	t.text	 	:shelfari_url
    	t.text	 	:description
    	t.string	:name

    	t.timestamps
    end

    create_table :characters_shelfari_books do |t|
    	t.belongs_to	:shelfari_book
    	t.belongs_to	:character

    	t.timestamps
    end

    create_table :location do |t|
    	t.string		:name
    	t.text			:url

    	t.timestamps
    end

    create_table :locations_shelfari_books do |t|
    	t.belongs_to	:location
    	t.belongs_to	:shelfari_book

    	t.timestamps
    end

    create_table :theme do |t|
    	t.string		:name
    	t.text			:description
    	t.text			:url

    	t.timestamps
    end

    create_table :shelfari_books_themes do |t|
    	t.belongs_to :shelfari_book
    	t.belongs_to :theme

    	t.timestamps
    end

  end
end
