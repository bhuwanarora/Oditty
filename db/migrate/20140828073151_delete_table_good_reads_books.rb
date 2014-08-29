class DeleteTableGoodReadsBooks < ActiveRecord::Migration
  def change
  	drop_table :good_reads_books
  end
end
