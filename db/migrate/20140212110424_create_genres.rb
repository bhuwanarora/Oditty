class CreateGenres < ActiveRecord::Migration
  def change
    create_table :genres do |t|
    	t.string :name

        t.timestamps
    end

    create_table :books_genres do |t|
    	t.belongs_to :book
    	t.belongs_to :genre

    	t.timestamps
    end

    add_column :book_covers, :other_info, :text
  end
end
