class ChangeTextToNameInTables < ActiveRecord::Migration
  def change
  	rename_column :read_times, :text, :name
  	rename_column :country_groups, :text, :name
  	rename_column :time_groups, :text, :name
  end
end
