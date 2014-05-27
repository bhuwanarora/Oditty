class CreateBookSubjectTimes < ActiveRecord::Migration
  def change
    create_table :book_subject_times do |t|
    	t.string :name
    	t.string :url

      t.timestamps
    end

    create_table :book_subject_times_books do |t|
    	t.belongs_to :book
    	t.belongs_to :subject_time

    	t.timestamps
    end
  end
end
