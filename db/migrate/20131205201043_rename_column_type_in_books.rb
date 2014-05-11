class RenameColumnTypeInBooks < ActiveRecord::Migration
  def change
  	rename_column :books, :type, :book_type
  end
end
