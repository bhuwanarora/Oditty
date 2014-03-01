class Edge < ActiveRecord::Base
	require 'uniquify'
	uniquify :uuid, :salt, :length => 12, :chars => 0..9

	attr_accessible :weight, :start_node_id, :end_node_id
end