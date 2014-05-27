class CreateTableLocationsShelfariBooks < ActiveRecord::Migration
  def change
    create_table :themes_shelfari_books do |t|
    	t.belongs_to :theme
    	t.belongs_to :shelfari_book

    	t.timestamps
    end

    create_table :ebooks do |t|
        t.string    :name
        t.text      :notes
        t.text      :url

        t.timestamps
    end

    create_table :ebooks_shelfari_books do |t|
        t.belongs_to :e_book
        t.belongs_to :shelfari_book

        t.timestamps
    end
  end
end
