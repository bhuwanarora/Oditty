class RenameReadingStatusTables < ActiveRecord::Migration
  def change
  	rename_table :reading_status, :reading_statuses
  end
end
