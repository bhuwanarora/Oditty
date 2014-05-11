class GoodReadsGenresTags < ActiveRecord::Migration
  def change
  	create_table :good_reads_genres_tags do |t|
  		t.belongs_to :good_reads_genre
  		t.belongs_to :tag

  		t.timestamps
  	end
  end
end
