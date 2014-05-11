class CreateFileParserStates < ActiveRecord::Migration
  def change
    create_table :file_parser_states do |t|
    	t.integer :line_number
    	t.boolean :status
    	t.string  :object_type

      t.timestamps
    end
  end
end
