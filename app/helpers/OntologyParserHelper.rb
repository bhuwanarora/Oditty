# module OntologyParserHelper

# 	line_num = 0
# 	text = File.open('/Users/bhuwan/Downloads/dbpedia_2015-04.owl').read
# 	text.gsub!(/\r\n?/, "\n")
# 	str_array = []

# 	text.each_line do |line|
# 		strin = line.split(" ")[0]
		
# 	 	isClass = "<owl:Class" == strin
# 	 	isComment = "<rdfs:comment" == strin
# 	 	isSubClass = "<rdfs:subClassOf" == strin
# 	 	isDerivedFrom = "<prov:wasDerivedFrom" == strin
# 	 	isDisjointWith = "<owl:disjointWith" == strin
# 	 	isEquivalentClass = "<owl:equivalentClass" == strin
# 	 	isDomain = "<rdfs:domain" == strin
# 	 	isRange = "<rdfs:range" == strin
# 	 	isType = "<rdf:type" == strin
# 	 	isSubpropertyOf = "<rdfs:subPropertyOf" ==  strin
# 	 	isDatatypeProperty = "<owl:DatatypeProperty" == strin
# 	 	isObjectProperty = "<owl:ObjectProperty" == strin
# 	 	if isClass
# 	 		# string_array = line.split("/")
# 	 		# className = string_array[string_array.length - 1].gsub(">", "").gsub("\"", "")
# 	 		# puts " #{className}"
# 	 	elsif isType
# 	 		# puts "isType"
# 	 	elsif isComment
# 	 		# puts "isComment"
# 	 	elsif isSubClass
# 	 		string_array = line.split("/")
# 	 		className = string_array[string_array.length - 2].gsub(">", "").gsub("\"", "")
# 	 		unless str_array.include? className
# 			 	str_array.push className
# 			 	puts "#{className} #{str_array.length}"
# 			end
# 	 	elsif isDerivedFrom
# 	 	# 	string_array = line.split("/")
# 	 	# 	className = string_array[string_array.length - 2].gsub(">", "").gsub("\"", "")
# 	 	# 	unless str_array.include? className
# 			#  	str_array.push className
# 			#  	puts "#{className} #{str_array.length}"
# 			# end
# 	 	elsif isDisjointWith
# 	 	# 	string_array = line.split("/")
# 	 	# 	className = string_array[string_array.length - 2].gsub(">", "").gsub("\"", "")
# 	 	# 	unless str_array.include? className
# 			#  	str_array.push className
# 			#  	puts "#{className} #{str_array.length}"
# 			# end
# 	 	elsif isEquivalentClass
# 	 		# puts "isEquivalentClass"
# 	 	elsif isDomain
#  		# 	string_array = line.split("/")
# 	 	# 	className = string_array[string_array.length - 2].gsub(">", "").gsub("\"", "")
# 	 	# 	unless str_array.include? className
# 			#  	str_array.push className
# 			#  	puts "#{className} #{str_array.length}"
# 			# end
# 	 	elsif isRange
#  		# 	string_array = line.split("/")
# 	 	# 	className = string_array[string_array.length - 2].gsub(">", "").gsub("\"", "")
# 	 	# 	unless str_array.include? className
# 			#  	str_array.push className
# 			#  	puts "#{className} #{str_array.length}"
# 			# end
# 	 	elsif isSubpropertyOf
#  		# 	string_array = line.split("/")
# 	 	# 	className = string_array[string_array.length - 2].gsub(">", "").gsub("\"", "")
# 	 	# 	unless str_array.include? className
# 			#  	str_array.push className
# 			#  	puts "#{className} #{str_array.length}"
# 			# end
# 	 	elsif isDatatypeProperty
#  		# 	string_array = line.split("/")
# 	 	# 	className = string_array[string_array.length - 1].gsub(">", "").gsub("\"", "")
# 	 	# 	unless str_array.include? className
# 			#  	str_array.push className
# 			#  	puts "#{className} #{str_array.length}"
# 			# end
# 	 	elsif isObjectProperty
# 	 	# 	string_array = line.split("/")
# 	 	# 	className = string_array[string_array.length - 1].gsub(">", "").gsub("\"", "")
# 	 	# 	unless str_array.include? className
# 			#  	str_array.push className
# 			#  	puts "#{className} #{str_array.length}"
# 			# end
# 	 	else
# 	 		# puts "DONT KNOW #{strin}"
# 	 	end

# 	 # 	puts " 155 Super Classes "
# 		# puts " 3396 Classes Driving other Classes "
# 		# puts " 5 isDisjoint With Classes"
# 		# puts " 294 Domains"
# 		# puts " 311 Range"
# 		# puts " 65 isSubpropertyOf"
# 		# puts " 1583 isDatatypeProperty"
# 		# puts " 1098 isObjectProperty"
# 	end

# end