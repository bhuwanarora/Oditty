class CreateFilters < ActiveRecord::Migration
  def change
    create_table :filters do |t|
    	t.string		:name
    	t.integer 	:priority

      	t.timestamps
    end

    create_table :filters_users do |t|
    	t.belongs_to	:filter
    	t.belongs_to	:user
      t.integer     :priority

    	t.timestamps
    end
  end
end