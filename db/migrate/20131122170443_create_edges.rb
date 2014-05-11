class CreateEdges < ActiveRecord::Migration
  def change
    create_table :edges do |t|
    	t.string 	:uuid
    	t.string 	:salt
    	t.integer 	:weight
    	t.integer	:start_node_id
    	t.integer	:end_node_id

      t.timestamps
    end
  end
end
