class CreateShelfariBooks < ActiveRecord::Migration
  def change
    create_table :shelfari_books do |t|
    	t.text 		:name
    	t.text 		:url
    	t.text		:description
    	t.text		:summary
    	t.boolean	:flag

      t.timestamps
    end
  end
end
