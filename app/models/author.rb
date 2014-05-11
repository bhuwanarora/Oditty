class Author < ActiveRecord::Base
	require 'uniquify'
	uniquify :uuid, :salt, :length => 12, :chars => 0..9

	attr_accessible :human_profile_id, :olid, :flag, :shelfari_url, :legal_name, :birthplace, :birthdate, 
					:nationality, :gender, :official_website, :date_of_death, :burial_location, :overview,
					:wiki_url, :comments

	belongs_to :human_profile
	has_and_belongs_to_many :books
	has_and_belongs_to_many :prizes
	has_and_belongs_to_many :shelfari_books

	def self.create_authors openlibrary_authors
		@authors = []
		openlibrary_authors.each do |author|
			@human_profile = HumanProfile.find_by(:name => author["name"])
			unless @human_profile.present?
				@human_profile = HumanProfile.create(:name => author["name"], :openlibrary_url => author["url"])
				create_author_for_human_profile
			else
				create_author_for_human_profile
			end
		end
		@authors
	end

	private
		def self.create_author_for_human_profile
			@author = Author.where(:human_profile_id => @human_profile.id).first
			unless @author.present?
				@author = Author.new(:human_profile_id => @human_profile.id)
				if @author.save
					@authors |= [@author]
				end
			else
				@authors |= [@author]
			end
		end
end
