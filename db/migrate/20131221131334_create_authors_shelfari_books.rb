class CreateAuthorsShelfariBooks < ActiveRecord::Migration
  def change
    create_table :authors_shelfari_books do |t|
    	t.belongs_to :author
    	t.belongs_to :shelfari_book
    end
  end
end
