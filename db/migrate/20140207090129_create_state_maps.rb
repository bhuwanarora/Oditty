class CreateStateMaps < ActiveRecord::Migration
  def change
    create_table :state_maps do |t|
    	t.string 		:page
    	t.boolean 		:status

      t.timestamps
    end
  end
end
