class CreateReadTimes < ActiveRecord::Migration
  def change
    create_table :read_times do |t|
    	t.string :text

      t.timestamps
    end
  end
end
