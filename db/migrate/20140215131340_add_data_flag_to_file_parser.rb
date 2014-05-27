class AddDataFlagToFileParser < ActiveRecord::Migration
  def change
  	add_column :file_parser_states, :data_flag, :boolean
  end
end
