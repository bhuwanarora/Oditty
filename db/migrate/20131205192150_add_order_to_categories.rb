class AddOrderToCategories < ActiveRecord::Migration
  def change
  	add_column :categories, :order, :string
  end
end
