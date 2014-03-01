class Book < ActiveRecord::Base
	# include Tire::Model::Search
 #   	include Tire::Model::Callbacks 
 #   	after_touch() { tire.update_index }

 #   	settings analysis: {
 #      tokenizer:{
 #        ngram_tokenizer_search:{
 #          type: "edgeNgram",
 #          min_gram: 3,
 #          max_gram: 7,
 #          token_chars: ["letter","digit"]  
 #        },
 #        ngram_tokenizer:{
 #          type: "nGram",
 #          min_gram: 1,
 #          max_gram: 7,
 #          token_chars: ["letter","digit"]  
 #        }
 #      },  
 #      analyzer: {
 #        word_analyzer_search: {
 #          type: 'custom',
 #          tokenizer: "ngram_tokenizer_search",
 #          filter: ["lowercase"]
 #        },
 #        word_analyzer: {
 #          type: 'custom',
 #          tokenizer: "ngram_tokenizer",
 #          filter: ["lowercase"]
 #        }
 #      } 
 #    } 

 #    mapping do
 #      indexes :url, 						:null_value => "",			:store => :yes #TODO NEEDS TO BE OPTIMIZED TO STORE = NO
 #      indexes :notes,						:null_value => "",			:store => :yes #TODO NEEDS TO BE OPTIMIZED TO STORE = NO
 #      indexes :title, 						:type   => 'completion', 	:payloads => true
 #    end

	
	uniquify :uuid, :salt, :length => 12, :chars => 0..9

	attr_accessible :title, :language_id, :pages, :book_series_id, :excerpts, :link,
					:weight, :subtitle, :table_of_contents, :contributions, :edition_name, :book_type, :notes, :title_prefix, 
					:physical_format, :physical_dimensions, :description, :url, :work_titles, :flag
	has_and_belongs_to_many :authors
	has_and_belongs_to_many :tags
	has_and_belongs_to_many :genres
	has_and_belongs_to_many :categories
	has_and_belongs_to_many :subject_places, :class_name => "::Book::SubjectPlace"
	has_and_belongs_to_many :subject_peoples, :class_name => "::Book::SubjectPeople"
	has_and_belongs_to_many :subject_times,  :class_name => "::Book::SubjectTime" 
	belongs_to :book_series
	belongs_to :language
	has_one :identifier, :class_name => "::Book::Identifier"
	has_one :publishing_details, :class_name => "::Book::PublishingDetails"
	has_many :covers, :class_name => "::Book::Cover"

	def to_indexed_json
	   to_json :except => [],
	           :methods => [:title, :notes, :url]
	end

	def self.search(params)
		response = nil
	  	tire.search(load: true) do
	    	response = query {string params}
	  	end
	  	response.results
	end

	def self.is_valid? isbn_number
	  (isbn_number.length == 10) && (isbn_number.split('').inject([10,0]){|a, c| i,s = a; [s+i*c.to_i,i-1]}.first%11==0)
	end

	def sorted_tags
		self.tags.order(:name)
	end

	def self.book_exists? isbn_10
		isbn_list = Book::Identifier.pluck(:isbn_10).flatten.grep /#{isbn_10}/
		!isbn_list.empty?
	end

	def self.get_book_id_by_isbn isbn_10
		book_id = Book::Identifier.select("book_id").where("book_identifiers.isbn_10 LIKE ?", "%#{isbn_10}%").to_json
		book_id = (JSON.parse book_id).map{|s| s["book_id"]}.compact
		book_id[0]
	end

	def sorted_tags
       	self.tags.order(:name)
    end

    def formatted_name
        self.title.gsub(" ", "_")+"_(novel)"
   	end

	# def self.search q
	# 	@client ||= self.initialize_client
	# 	@results = @client.search(q)
	# 	@results
	# end

end