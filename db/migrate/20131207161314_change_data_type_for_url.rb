class ChangeDataTypeForUrl < ActiveRecord::Migration
  def change
  	change_column :books, :url, :text
  end
end
