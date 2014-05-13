class CreateTimeGroups < ActiveRecord::Migration
  def change
    create_table :time_groups do |t|
    	t.string :text

      t.timestamps
    end
  end
end
