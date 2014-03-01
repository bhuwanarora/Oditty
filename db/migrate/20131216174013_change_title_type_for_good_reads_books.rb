class ChangeTitleTypeForGoodReadsBooks < ActiveRecord::Migration
  def change
  	change_column :good_reads_books, :title, :text
  end
end
