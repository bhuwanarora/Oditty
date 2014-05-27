class CreateReadingStatus < ActiveRecord::Migration
  def change
    create_table :reading_status do |t|
    	t.string :name

      t.timestamps
    end
  end
end
