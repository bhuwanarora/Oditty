class AddLineTextToFileParser < ActiveRecord::Migration
  def change
  	add_column :file_parser_states, :data, :text
  end
end
