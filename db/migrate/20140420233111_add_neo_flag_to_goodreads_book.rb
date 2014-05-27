class AddNeoFlagToGoodreadsBook < ActiveRecord::Migration
  def change
  	add_column :good_reads_books, :neo_flag, :boolean
  end
end
