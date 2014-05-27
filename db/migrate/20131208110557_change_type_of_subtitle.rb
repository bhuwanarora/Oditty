class ChangeTypeOfSubtitle < ActiveRecord::Migration
  def change
  	change_column :books, :subtitles, 			:text
  	change_column :books, :title_prefix, 		:text
  	change_column :books, :physical_dimensions, :text
  	change_column :books, :subtitle,			:text
  end
end
