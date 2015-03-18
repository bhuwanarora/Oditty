module QueryTesterHelper
	def self.return_user
		neo = Neography::Rest.new
		clause = " match (a:User) return a.name, a.password as name limit 4"
		neo.execute_query clause
	end
end