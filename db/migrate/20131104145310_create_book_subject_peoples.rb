class CreateBookSubjectPeoples < ActiveRecord::Migration
  def change
    create_table :book_subject_peoples do |t|
    	t.string :name
    	t.string :url

      t.timestamps
    end

    create_table :book_subject_peoples_books do |t|
    	t.belongs_to :book
    	t.belongs_to :subject_people

    	t.timestamps
    end
  end
end
