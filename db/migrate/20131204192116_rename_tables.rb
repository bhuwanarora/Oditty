class RenameTables < ActiveRecord::Migration
  def change
  	rename_table :book_subject_peoples, :book_subject_people
  end
end
