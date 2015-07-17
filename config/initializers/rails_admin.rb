# RailsAdmin config file. Generated on December 05, 2013 21:05
# See github.com/sferik/rails_admin for more informations

RailsAdmin.config do |config|
  config.authorize_with do
    authenticate_or_request_with_http_basic('Please enter the admin credentials') do |username, password|
      username == 'admin' && password == 'coming_soon'
    end
  end

  config.actions do
    # root actions
    dashboard                     # mandatory
    # collection actions
    index                         # mandatory
    new
    export
    history_index
    bulk_delete
    # member actions
    show
    edit
    delete
    history_show
    show_in_app

    # Add the nestable action for configured models
    nestable
  end

  ################  Global configuration  ################

  # Set the admin name here (optional second array element will appear in red). For example:
  config.main_app_name = ['Readers Door', 'Admin']
  # or for a more dynamic name:
  # config.main_app_name = Proc.new { |controller| [Rails.application.engine_name.titleize, controller.params['action'].titleize] }

  # RailsAdmin may need a way to know who the current user is]
  # config.current_user_method { current_user } # auto-generated
  config.authenticate_with {}

  # If you want to track changes on your models:
  config.audit_with :history, 'User'

  # Or with a PaperTrail: (you need to install it first)
  # config.audit_with :paper_trail, 'User'

  # Display empty fields in show views:
  config.compact_show_view = false

  # Number of default rows per-page:
  config.default_items_per_page = 50

  # Exclude specific models (keep the others):
  # config.excluded_models = ['Admin', 'Author', 'AuthorsBooks', 'Book', 'Book::Cover', 'Book::Identifier', 'Book::PublishingDetails', 'Book::SubjectPeople', 'Book::SubjectPlace', 'Book::SubjectTime', 'BookSeries', 'BooksTags', 'BooksUsers', 'Category', 'Edge', 'Gender', 'HumanProfile', 'HumanProfile::Address', 'Language', 'Prize', 'Profession', 'Publisher', 'ReadingStatus', 'RelationType', 'Tag', 'User']

  # Include specific models (exclude the others):
  config.included_models = ['Admin', 'Author', 'Book', 'Book::Cover', 'Book::Identifier', 
    'Book::PublishingDetails', 'Book::SubjectPeople', 'Book::SubjectPlace', 'Book::SubjectTime', 'BookSeries',
    'Category', 'Edge', 'Gender', 'HumanProfile', 'HumanProfile::Address', 'Language', 
    'Prize', 'Profession', 'Publisher', 'ReadingStatus', 'RelationType', 'Tag', 'User',
    'ReadersDoorAdmin', 'ShelfariBook', 'NoteForParent',
    'ShelfariCategory', 'ShelfariTag', 'Quote', 'Location', 'Theme', 'Character', 'Ebook', 'Movie',
    'ComingSoonPageQuotes', 'FacebookUserAuthentication', 'GoogleUserAuthentication', 'Genre', 'FileParserState']

  # Label methods for model instances:
  config.label_methods << :name # Default is [:name, :title]


  ################  Model configuration  ################

  # Each model configuration can alternatively:
  #   - stay here in a `config.model 'ModelName' do ... end` block
  #   - go in the model definition file in a `rails_admin do ... end` block

  # This is your choice to make:
  #   - This initializer is loaded once at startup (modifications will show up when restarting the application) but all RailsAdmin configuration would stay in one place.
  #   - Models are reloaded at each request in development mode (when modified), which may smooth your RailsAdmin development workflow.


  # Now you probably need to tour the wiki a bit: https://github.com/sferik/rails_admin/wiki
  # Anyway, here is how RailsAdmin saw your application's models when you ran the initializer:

  config.model 'Genre' do
    configure :name
  end

  config.model 'ComingSoonPageQuotes' do
    configure :quote
    configure :author
  end

  config.model 'GoogleUserAuthentication' do
    configure :user, :belongs_to_association
  end

  config.model 'FacebookUserAuthentication' do
    configure :user, :belongs_to_association
    configure :link
    configure :first_name
    configure :last_name
    configure :uid
    configure :location_name
    configure :oauth_token
  end

  config.model 'Movie' do
    configure :name
    configure :imdb_url
    configure :year
    configure :shelfari_books, :has_and_belongs_to_many_association
  end

  config.model 'NoteForParent' do
    configure :name
    configure :url
    configure :shelfari_books, :has_and_belongs_to_many_association
  end

  config.model 'Ebook' do
    configure :name
    configure :notes
    configure :url
    configure :shelfari_books, :has_and_belongs_to_many_association
  end

  config.model 'Location' do
    configure :name
    configure :url
    configure :shelfari_books, :has_and_belongs_to_many_association
  end

  config.model 'Theme' do
    configure :name
    configure :url
    configure :description
    configure :shelfari_books, :has_and_belongs_to_many_association
  end

  config.model 'Character' do
    configure :name
    configure :shelfari_url
    configure :description
    configure :shelfari_books, :has_and_belongs_to_many_association
  end

  config.model 'Quote' do
    configure :name, :string
    configure :url, :text
    configure :person, :text
    configure :person_url, :text
    configure :flag, :boolean
  end

  config.model 'ShelfariBook' do
    configure :name, :string
    configure :url, :text
    configure :flag, :boolean
    configure :data_flag, :boolean
    configure :summary, :text
    configure :description, :text
    configure :shelfari_tags, :has_and_belongs_to_many_association
    configure :shelfari_categories, :has_and_belongs_to_many_association
    configure :locations, :has_and_belongs_to_many_association
    configure :characters, :has_and_belongs_to_many_association
    configure :themes, :has_and_belongs_to_many_association
    configure :note_for_parents, :has_and_belongs_to_many_association
    configure :quotes, :has_and_belongs_to_many_association
    configure :movies, :has_and_belongs_to_many_association
    configure :authors, :has_and_belongs_to_many_association
    configure :ebooks, :has_and_belongs_to_many_association
    show do; end
  end

  config.model 'ShelfariTag' do
    configure :name, :string
    configure :url, :text
    configure :flag, :boolean
    show do; end
  end

  config.model 'ShelfariCategory' do
    nestable_tree({
      max_depth: 1
    })

    configure :order, :string 
    configure :ancestry, :string 
    configure :name, :string
    configure :url, :text
    configure :flag, :boolean
    show do; end
  end

  config.model 'ReadersDoorAdmin' do
    configure :email, :string 
    configure :name, :string
    show do; end
  end

  # config.model 'GoodReadsBook' do
  #   configure :title, :string
  #   configure :description, :text
  #   configure :rating, :string
  #   configure :authorName, :string
  #   configure :isbn, :string
  #   configure :url, :string

  #   show do; end
  #   edit do; end
  # end

  # config.model 'GoodReadsGenre' do
  #   configure :name, :string
  #   configure :book_count, :integer
  #   configure :tags, :has_and_belongs_to_many_association
  #   show do; end
  #   edit do; end
  # end

  config.model 'Admin' do

  #   # You can copy this to a 'rails_admin do ... end' block inside your admin.rb model definition

  #   # Found associations:



  #   # Found columns:

      configure :email, :string 
      configure :password, :password         # Hidden 
      configure :password_confirmation, :password         # Hidden 
      configure :reset_password_token, :string         # Hidden 
      configure :reset_password_sent_at, :datetime 
      configure :remember_created_at, :datetime 
      configure :sign_in_count, :integer 
      configure :current_sign_in_at, :datetime 
      configure :last_sign_in_at, :datetime 
      configure :current_sign_in_ip, :string 
      configure :last_sign_in_ip, :string 

  #   # Cross-section configuration:

  #     # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
  #     # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
  #     # label_plural 'My models'      # Same, plural
  #     # weight 0                      # Navigation priority. Bigger is higher.
  #     # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
  #     # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

  #   # Section specific configuration:

      list do
        filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        items_per_page 100    # Override default_items_per_page
        sort_by :id           # Sort column (default is primary key)
        sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
  #     # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
  #     # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
  #     # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ###  Author  ###

  config.model 'Author' do

    # You can copy this to a 'rails_admin do ... end' block inside your author.rb model definition

    # Found associations:

      configure :olid, :string 
      configure :legal_name, :string
      configure :birthplace, :string
      configure :birthdate, :string
      configure :nationality, :string
      configure :gender, :string
      configure :official_website, :string
      configure :date_of_death, :string
      configure :burial_location, :string
      configure :overview, :text
      configure :human_profile, :belongs_to_association 
      configure :books, :has_and_belongs_to_many_association 
      configure :prizes, :has_and_belongs_to_many_association 

    # Found columns:


  #   # Cross-section configuration:

  #     # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
  #     # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
  #     # label_plural 'My models'      # Same, plural
  #     # weight 0                      # Navigation priority. Bigger is higher.
  #     # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
  #     # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

  #   # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end

  config.model 'BookSubjectPlacesBooks' do
    configure :book, :belongs_to_association
    configure :subject_place, :belongs_to_association
    list do
    end
    show do; end
    edit do; end
    export do; end
  end


  ##  AuthorsBooks  ###

  config.model 'AuthorsBooks' do

    # You can copy this to a 'rails_admin do ... end' block inside your authors_books.rb model definition

    # Found associations:

      configure :author, :belongs_to_association 
      configure :book, :belongs_to_association 

    # Found columns:


    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end

  config.model 'FileParserState' do
    configure :line_number, :string
    configure :status, :boolean
    configure :object_type, :string
    configure :data, :text

  end 


  ##  Book  ###

  config.model 'Book' do

    # You can copy this to a 'rails_admin do ... end' block inside your book.rb model definition

    # Found associations:

      configure :title, :string 
      configure :authors, :has_and_belongs_to_many_association 
      configure :url, :string 
      configure :description, :text 
      configure :physical_format, :string 
      configure :language, :belongs_to_association 
      configure :book_series, :belongs_to_association 
      configure :tags, :has_and_belongs_to_many_association 
      configure :categories, :has_and_belongs_to_many_association 
      configure :subject_places, :has_and_belongs_to_many_association 
      configure :subject_peoples, :has_and_belongs_to_many_association 
      configure :subject_times, :has_and_belongs_to_many_association 
      configure :genres, :has_and_belongs_to_many_association
      configure :identifier, :has_one_association 
      configure :publishing_details, :has_one_association 
      configure :covers, :has_many_association 

    # Found columns:

      configure :excerpts, :text 
      configure :pages, :integer 
      configure :published_on, :datetime 
      configure :subtitle, :string 
      configure :link, :string 
      configure :weight, :integer 
      configure :table_of_contents, :text 
      configure :contributions, :text 
      configure :edition_name, :string 
      configure :book_type, :string 
      configure :notes, :text 
      configure :subtitles, :string 
      configure :title_prefix, :string 
      configure :physical_dimensions, :string 
      configure :works, :text 
      configure :work_titles, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  Book::Cover  ###

  config.model 'Book::Cover' do

    # You can copy this to a 'rails_admin do ... end' block inside your book/cover.rb model definition

    # Found associations:

      configure :book, :belongs_to_association 

    # Found columns:

      configure :small, :string 
      configure :medium, :string 
      configure :large, :string 
      configure :other_info, :text

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  Book::Identifier  ###

  config.model 'Book::Identifier' do

    # You can copy this to a 'rails_admin do ... end' block inside your book/identifier.rb model definition

    # Found associations:

      configure :book, :belongs_to_association 

    # Found columns:

      configure :isbn_10, :string 
      configure :lccn, :string 
      configure :openlibrary, :string 
      configure :oclc, :string 
      configure :librarything, :string 
      configure :project_gutenberg, :string 
      configure :goodreads, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  Book::PublishingDetails  ###

  config.model 'Book::PublishingDetails' do

    # You can copy this to a 'rails_admin do ... end' block inside your book/publishing_details.rb model definition

    # Found associations:

      configure :book, :belongs_to_association 
      configure :publishers, :has_many_association 

    # Found columns:

      configure :date, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  Book::SubjectPeople  ###

  config.model 'Book::SubjectPeople' do

    # You can copy this to a 'rails_admin do ... end' block inside your book/subject_people.rb model definition

    # Found associations:

      configure :books, :has_and_belongs_to_many_association 

    # Found columns:

      configure :name, :string 
      configure :url, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  Book::SubjectPlace  ###

  config.model 'Book::SubjectPlace' do

    # You can copy this to a 'rails_admin do ... end' block inside your book/subject_place.rb model definition

    # Found associations:

      configure :books, :has_and_belongs_to_many_association 

    # Found columns:

      configure :name, :string 
      configure :url, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  Book::SubjectTime  ###

  config.model 'Book::SubjectTime' do

    # You can copy this to a 'rails_admin do ... end' block inside your book/subject_time.rb model definition

    # Found associations:

      configure :books, :has_and_belongs_to_many_association 

    # Found columns:

      configure :name, :string 
      configure :url, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  BookSeries  ###

  config.model 'BookSeries' do

    # You can copy this to a 'rails_admin do ... end' block inside your book_series.rb model definition

    # Found associations:

      configure :books, :has_many_association 

    # Found columns:

      configure :name, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  BooksTags  ###

  config.model 'BooksTags' do

    # You can copy this to a 'rails_admin do ... end' block inside your books_tags.rb model definition

    # Found associations:

      configure :book, :belongs_to_association 
      configure :tag, :belongs_to_association 

    # Found columns:


    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  BooksUsers  ###

  config.model 'BooksUsers' do

    # You can copy this to a 'rails_admin do ... end' block inside your books_users.rb model definition

    # Found associations:

      configure :reading_status, :belongs_to_association 
      configure :relation_type, :belongs_to_association 
      configure :book, :belongs_to_association 
      configure :user, :belongs_to_association 

    # Found columns:

      configure :given_on, :datetime 
      configure :borrowed_on, :datetime 
      configure :registered_on, :datetime 
      configure :review, :text 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  Category  ###

  config.model 'Category' do
    configure :name, :string 

    nestable_tree({
      max_depth: 6
    })

    # You can copy this to a 'rails_admin do ... end' block inside your category.rb model definition

    # Found associations:



    # Found columns:

      configure :order, :string 
      configure :ancestry, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  Edge  ###

  config.model 'Edge' do

    # You can copy this to a 'rails_admin do ... end' block inside your edge.rb model definition

    # Found associations:



    # Found columns:

      configure :weight, :integer 
      configure :start_node_id, :integer 
      configure :end_node_id, :integer 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  Gender  ###

  config.model 'Gender' do

    # You can copy this to a 'rails_admin do ... end' block inside your gender.rb model definition

    # Found associations:



    # Found columns:

      configure :name, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  HumanProfile  ###

  config.model 'HumanProfile' do

    # You can copy this to a 'rails_admin do ... end' block inside your human_profile.rb model definition

    # Found associations:

      configure :gender, :belongs_to_association 
      configure :address, :belongs_to_association 
      configure :profession, :belongs_to_association 

    # Found columns:

      configure :name, :string 
      configure :born_on, :date 
      configure :is_alive, :boolean 
      configure :openlibrary_url, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  HumanProfile::Address  ###

  config.model 'HumanProfile::Address' do

    # You can copy this to a 'rails_admin do ... end' block inside your human_profile/address.rb model definition

    # Found associations:

      configure :human_profile, :has_one_association 

    # Found columns:


    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  Language  ###

  config.model 'Language' do

    # You can copy this to a 'rails_admin do ... end' block inside your language.rb model definition

    # Found associations:

      configure :books, :has_many_association 

    # Found columns:

      configure :name, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  Prize  ###

  config.model 'Prize' do

    # You can copy this to a 'rails_admin do ... end' block inside your prize.rb model definition

    # Found associations:

      configure :authors, :has_and_belongs_to_many_association 

    # Found columns:

      configure :name, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  Profession  ###

  config.model 'Profession' do

    # You can copy this to a 'rails_admin do ... end' block inside your profession.rb model definition

    # Found associations:



    # Found columns:

      configure :name, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  Publisher  ###

  config.model 'Publisher' do

    # You can copy this to a 'rails_admin do ... end' block inside your publisher.rb model definition

    # Found associations:

      configure :publishing_details, :belongs_to_association 

    # Found columns:

      configure :name, :string 
      configure :url, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  ReadingStatus  ###

  config.model 'ReadingStatus' do

    # You can copy this to a 'rails_admin do ... end' block inside your reading_status.rb model definition

    # Found associations:

      configure :books_users, :has_many_association         # Hidden 

    # Found columns:

      configure :name, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  RelationType  ###

  config.model 'RelationType' do

    # You can copy this to a 'rails_admin do ... end' block inside your relation_type.rb model definition

    # Found associations:

      configure :books_users, :has_many_association         # Hidden 

    # Found columns:

      configure :name, :string 

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  Tag  ###

  config.model 'Tag' do
      configure :name, :string 
      configure :description, :string 

    # You can copy this to a 'rails_admin do ... end' block inside your tag.rb model definition

    # Found associations:



    # Found columns:


    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end


  ##  User  ###

  config.model 'User' do

    # You can copy this to a 'rails_admin do ... end' block inside your user.rb model definition

    # Found associations:

      configure :human_profile, :belongs_to_association 
      configure :books, :has_and_belongs_to_many_association 

    # Found columns:

      configure :email, :string 
      configure :is_subscribed, :boolean

    # Cross-section configuration:

      # object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
      # label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
      # label_plural 'My models'      # Same, plural
      # weight 0                      # Navigation priority. Bigger is higher.
      # parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
      # navigation_label              # Sets dropdown entry's name in navigation. Only for parents!

    # Section specific configuration:

      list do
        # filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
        # items_per_page 100    # Override default_items_per_page
        # sort_by :id           # Sort column (default is primary key)
        # sort_reverse true     # Sort direction (default is true for primary key, last created first)
      end
      show do; end
      edit do; end
      export do; end
      # also see the create, update, modal and nested sections, which override edit in specific cases (resp. when creating, updating, modifying from another model in a popup modal or modifying from another model nested form)
      # you can override a cross-section field configuration in any section with the same syntax `configure :field_name do ... end`
      # using `field` instead of `configure` will exclude all other fields and force the ordering
  end

end
