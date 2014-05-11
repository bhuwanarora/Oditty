class CreateBooksUsers < ActiveRecord::Migration
  def change
    create_table :books_users do |t|
    	t.integer 	 :reading_status_id
    	t.integer    :relation_type_id
    	t.datetime   :given_on
    	t.datetime   :borrowed_on
    	t.datetime   :registered_on
    	t.text       :review
    	t.belongs_to :book
    	t.belongs_to :user
    	
      t.timestamps
    end
  end
end
