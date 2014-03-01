class AddFieldsToAuthor < ActiveRecord::Migration
  def change
  	add_column :authors, :legal_name, :string
  	add_column :authors, :birthdate, :string
  	add_column :authors, :birthplace, :string
  	add_column :authors, :nationality, :string
  	add_column :authors, :gender, :string
  	add_column :authors, :official_website, :text
  	add_column :authors, :date_of_death, :string
  	add_column :authors, :burial_location, :string

  end
end
