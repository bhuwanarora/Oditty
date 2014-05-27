class CreatePrizes < ActiveRecord::Migration
  def change
    create_table :prizes do |t|
    	t.string :name

      t.timestamps
    end

    create_table :authors_and_prizes do |t|
    	t.belongs_to :author
    	t.belongs_to :prize

    	t.timestamps
    end
  end
end
