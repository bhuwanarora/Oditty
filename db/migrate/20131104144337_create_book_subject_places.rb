class CreateBookSubjectPlaces < ActiveRecord::Migration
  def change
    create_table :book_subject_places do |t|
    	t.string :name
    	t.string :url

      t.timestamps
    end

    create_table :book_subject_places_books do |t|
    	t.belongs_to :book
    	t.belongs_to :subject_place

    	t.timestamps
    end
  end
end
