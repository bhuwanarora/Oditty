class ChangeTypeOfEditionName < ActiveRecord::Migration
  def change
  	change_column :books, :edition_name, 	:text
  	change_column :books, :title, 			:text
  end
end
