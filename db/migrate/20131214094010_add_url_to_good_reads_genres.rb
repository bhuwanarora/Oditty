class AddUrlToGoodReadsGenres < ActiveRecord::Migration
  def change
  	add_column :good_reads_genres, :url, :text
  end
end
