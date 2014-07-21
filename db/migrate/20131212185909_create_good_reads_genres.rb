class CreateGoodReadsGenres < ActiveRecord::Migration
  def change
    create_table :good_reads_genres do |t|
    	t.string :name

      t.timestamps
    end
  end
end
