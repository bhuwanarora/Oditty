class AddUuidToAllTables < ActiveRecord::Migration
  def change
  	add_column :human_profiles, :uuid, :string
  	add_column :human_profile_addresses, :uuid, :string
  	add_column :genders, :uuid, :string
  	add_column :professions, :uuid, :string
  	add_column :authors, :uuid, :string
  	add_column :users, :uuid, :string
  	add_column :prizes, :uuid, :string
  	add_column :book_series, :uuid, :string
  	add_column :languages, :uuid, :string
  	add_column :books, :uuid, :string
  	add_column :book_subject_places_books, :uuid, :string
  	add_column :book_identifiers, :uuid, :string
  	add_column :book_subject_peoples, :uuid, :string
  	add_column :book_subject_peoples_books, :uuid, :string
  	add_column :book_subject_times, :uuid, :string
  	add_column :book_subject_times_books, :uuid, :string
  	add_column :book_publishing_details, :uuid, :string
  	add_column :publishers, :uuid, :string
  	add_column :book_covers, :uuid, :string

    add_column :human_profiles, :salt, :string
    add_column :human_profile_addresses, :salt, :string
    add_column :genders, :salt, :string
    add_column :professions, :salt, :string
    add_column :authors, :salt, :string
    add_column :users, :salt, :string
    add_column :prizes, :salt, :string
    add_column :book_series, :salt, :string
    add_column :languages, :salt, :string
    add_column :books, :salt, :string
    add_column :book_subject_places_books, :salt, :string
    add_column :book_identifiers, :salt, :string
    add_column :book_subject_peoples, :salt, :string
    add_column :book_subject_peoples_books, :salt, :string
    add_column :book_subject_times, :salt, :string
    add_column :book_subject_times_books, :salt, :string
    add_column :book_publishing_details, :salt, :string
    add_column :publishers, :salt, :string
    add_column :book_covers, :salt, :string
  end
end