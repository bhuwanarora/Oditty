class AddColumntoTimeGroup < ActiveRecord::Migration
  def change
  	add_column :time_groups, :time_group, :string
  end
end
