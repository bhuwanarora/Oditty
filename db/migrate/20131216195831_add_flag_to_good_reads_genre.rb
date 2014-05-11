class AddFlagToGoodReadsGenre < ActiveRecord::Migration
  def change
  	add_column :good_reads_genres, :flag, :boolean
  end
end
