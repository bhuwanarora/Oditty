class AddUpdateFlagToGoodReadsBooks < ActiveRecord::Migration
  def change
  	add_column :good_reads_books, :flag, :boolean
  end
end
