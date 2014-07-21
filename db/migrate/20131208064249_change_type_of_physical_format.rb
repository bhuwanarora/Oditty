class ChangeTypeOfPhysicalFormat < ActiveRecord::Migration
  def change
  	change_column :books, :physical_format, :text
  end
end
