class CreateCountryGroups < ActiveRecord::Migration
  def change
    create_table :country_groups do |t|
    	t.string :text

      	t.timestamps
    end
  end
end
