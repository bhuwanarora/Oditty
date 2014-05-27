class CreateQuotes < ActiveRecord::Migration
  def change
    create_table :quotes do |t|
    	t.text 	:name
    	t.text	:url
    	t.text  :person
    	t.text	:person_url
    	t.boolean :flag

      t.timestamps
    end
  end
end
