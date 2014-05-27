class CreateComingSoonPageQuotes < ActiveRecord::Migration
  def change
    create_table :coming_soon_page_quotes do |t|
    	t.text :quote
    	t.string :author

      t.timestamps
    end
  end
end
