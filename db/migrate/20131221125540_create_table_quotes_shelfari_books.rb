class CreateTableQuotesShelfariBooks < ActiveRecord::Migration
  def change
    create_table :quotes_shelfari_books do |t|
    	t.belongs_to :quote
    	t.belongs_to :shelfari_book

    	t.timestamps
    end
  end
end
