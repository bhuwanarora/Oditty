module ShelfariCrawler
  include ELogger
  # require 'audite'
  require 'nokogiri'
  require 'open-uri'
  puts "Shelfari crawler..."

  def self.parse
    begin
      @root = ShelfariCategory.find_or_create_by(:name => "ROOT")
      base_url = "http://www.shelfari.com/"
      url = base_url+"books/subjects"
      unless @root.flag
        doc = Nokogiri::HTML(open(url))
        category_tree = doc.css('.children a')
        category_tree.each do |category|
        	category_name = category.content
        	category_url = category.attr('href')
          puts "Enqueue #{category_name}, #{category_url}, parent: #{@root.name}"
          Resque.enqueue(ShelfariCategoryCrawlerWorker, @root.id, category_name, category_url)
        end
        @root.update_attributes(:flag => true)
      end
    rescue => err
      ELogger.log_info "DEBUG: #{@root.id}, #{err}"
      puts "DEBUG: #{@root.id}, #{err}" 
    end
  end

  def self.handle_missed_categries
    begin
      ShelfariCategory.where(:flag => nil).each do |category|
        category_name = category.name
        category_url = category.url
        parent_id = category.parent.id
        Resque.enqueue(ShelfariCategoryCrawlerWorker, parent_id, category_name, category_url)
      end
    rescue Exception => e
      initialize_player
      ELogger.log_info "DEBUG #{category.id} #{e}"
      puts "DEBUG #{category.id} #{e}"
    end
  end

  def self.add_category(parent_id, name, url)
    begin
      parent_category = ShelfariCategory.find(parent_id)
      shelfari_category = parent_category.children.where(:name => name).first
      unless shelfari_category
        shelfari_category = parent_category.children.create(:name => name, :url => url)
      end 
      unless shelfari_category.flag
        doc = Nokogiri::HTML(open(url))
        category_tree = doc.css('.children a')
        category_hrefs = category_tree.map {|s| s.attr('href')}
        unless category_hrefs.include? shelfari_category.url
          category_tree.each do |category|
            category_name = category.content
            category_url = category.attr('href')
            if category_name && category_url != shelfari_category.url
              puts "Enqueue #{category_name}, #{category_url}, parent: #{shelfari_category.name}"
              Resque.enqueue(ShelfariCategoryCrawlerWorker, shelfari_category.id, category_name, category_url) 
            else
              puts "LEAF REACHED WITH #{shelfari_category.name}"
              break
            end
          end
        else
          puts "LEAF REACHED WITH #{shelfari_category.name}"
        end
        shelfari_category.update_attributes(:flag => true)
      end
    rescue => err
      ELogger.log_info "DEBUG: #{parent_id} #{name} #{url} #{err}"
      puts "DEBUG: #{parent_id} #{name} #{url} #{err}"
    end
  end

  def self.get_books
    begin
      StateMap.all.find_each do |state|
        begin
          unless state.status
            i = state.page
            url = "http://www.shelfari.com/books/subjects?Page=#{i}"
            puts "enqueue #{i}"
            Resque.enqueue(ShelfariBookListWorker, url)
          end
        rescue => err
          ELogger.log_info "Internal DEBUG get_books #{err}"      
        end
      end
    rescue => err
      ELogger.log_info "DEBUG get_books #{err}"
    end
  end

  def self.get_list_of_books(url)
    puts url
    begin
      page = url.split("Page=")[1]
      doc = Nokogiri::HTML(open(url))
      # next_page_url = doc.css('.float_right b')
      # unless next_page_url.empty?
      doc.css('.text h3 a').each do |book|
        book_name = book.content rescue nil
        book_url = book.attr("href") rescue nil
        if book_name
          book = ShelfariBook.find_or_create_by(:name => book_name, :url => book_url) 
        else 
          ELogger.log_info "DEBUG nil book name for #{url}"
        end
      end
      StateMap.where(:page => page).first.update_column(:status, true)
      # end
    rescue => err
      puts "DEBUG #{err} #{url} get_list_of_books"
      ELogger.log_info "DEBUG #{err} #{url} get_list_of_books"
    end
  end

  def self.crawl_books
    ShelfariBook.where(:data_flag => nil).find_each do |book|
      puts "enqueue #{book.name}"
      Resque.enqueue(ShelfariBookCrawlerWorker, book.id, book.url)
    end
  end

  def self.get_book_details(id, url)
    begin
      book = ShelfariBook.find(id)
      unless book.flag
        puts "#{book.name}"
        doc = Nokogiri::HTML(open(url))
        description = doc.css('#WikiModule_Description p')[0].content rescue nil
        book.description = description

        summary = doc.css('#WikiModule_PlotSummaryFull p')
        short_version = ""
        complete_version = ""
        if summary
          index = 0
          while summary[index]!=nil
            if index == 0
              short_version = summary[index].content
            else
              complete_version = complete_version+"\n"+summary[index].content
            end
            index = index + 1
          end
          unless complete_version.blank?
            summary = complete_version
          else
            summary = short_version
          end
          book.summary = summary
        end
        characters = doc.css('#WikiModule_Characters li')
        index = 0
        while characters && characters[index]!=nil
          character_description = characters[index].children[1].content rescue nil
          name = characters[index].children[0].content rescue nil
          character_url = characters[index].children[0].attr("href") rescue nil
          index = index + 1
          character = Character.find_or_create_by(:name => name, 
                                                  :shelfari_url => character_url, 
                                                  :description => character_description)
          CharactersShelfariBooks.find_or_create_by(:shelfari_book_id => id,
                                                    :character_id => character.id)
        end
        locations = doc.css('#WikiModule_Settings li')
        index = 0
        while locations && locations[index]!=nil
          if locations[index].content.include? ":"
            location_name = locations[index].content.split(":")[0]
            location_description = locations[index].content.split(":")[1]
          else
            location_name = locations[index].content rescue nil
            location_description = nil
          end
          location_href = locations[index].children[0].attr("href") rescue nil 
          location = Location.find_or_create_by(:name => location_name, 
                                                :url => location_href)
          LocationsShelfariBooks.find_or_create_by(:location_id => location.id,
                                                  :shelfari_book_id => id,
                                                  :description => location_description  )
          index = index + 1
        end
        first_sentence = doc.css('#WikiModule_FirstWords .ugc')[0].content rescue nil
        book.first_sentence = first_sentence
        index = 0
        themes = doc.css('#WikiModule_Themes li')
        while themes && themes[index]!=nil
          if themes[index].content.include? ":"
            theme_name = themes[index].content.split(":")[0]
            theme_description = themes[index].content.split(":")[1]
          else
            theme_name = themes[index].content rescue nil
            theme_description = nil
          end
          # theme_name = themes[index].content rescue nil
          # theme_name.slice!(": Describe this theme.") if theme_name
          theme_url = themes[index].children[0].attr("href")
          theme = Theme.find_or_create_by(:name => theme_name,
                                          :url => theme_url)
          ShelfariBooksThemes.find_or_create_by(:theme_id => theme.id,
                                                :shelfari_book_id => id,
                                                :description => theme_description)
          index = index + 1
        end

        index = 0
        quotes = doc.css('#WikiModule_Quotations li')
        while quotes && quotes[index]!=nil
           person_url = quotes[index].children[3].children[0].attr("href") rescue nil
           name = quotes[index].children[1].content rescue nil
           person = quotes[index].children[3].content rescue nil
           quote = Quote.find_or_create_by(:name => name)
           quote.update_attributes(:person => person, :person_url => person_url)
           QuotesShelfariBooks.find_or_create_by(:quote_id =>  quote.id,
                                                :shelfari_book_id => id)
           index = index + 1
        end
        note_for_parents = doc.css('#WikiModule_Parents .editable')
        index = 0
        while note_for_parents && note_for_parents[index]!=nil
          note_url = note_for_parents[index].children[5].attr("href")
          note = note_for_parents[index].children[5].content
          note = NoteForParent.find_or_create_by(:name => note,
                                                :url => note_url)
          NoteForParentsShelfariBooks.find_or_create_by(:note_for_parent_id => note.id,
                                                        :shelfari_book_id => id)
          index = index + 1
        end
        index = 0
        movies = doc.css('#WikiModule_Movies li')
        while movies && movies[index]!=nil
          movies_url = movies[index].children[0].attr("href")
          if movies[index].content.include? ":"
            movie_name = movies[index].content.split(":")[0]
            movie_description = movies[index].content.split(":")[1]
          else
            movie_name = movies[index].content
            movie_description = nil
          end
          movie = Movie.find_or_create_by(:imdb_url => movies_url,
                                          :name => movie_name)
          MoviesShelfariBooks.find_or_create_by(:movie_id => movie.id,
                                                :shelfari_book_id => id,
                                                :description => movie_description)
          index = index + 1
        end

        index = 0
        authors = doc.css('.primary a')
        while authors && authors[index]!=nil
          name = authors[index].content
          authors_url = authors[index].attr("href")
          human_profile = HumanProfile.find_or_create_by(:name => name)
          author = Author.find_or_create_by(:human_profile_id => human_profile.id)
          AuthorsShelfariBooks.find_or_create_by(:author_id => author.id,
                                                  :shelfari_book_id => id)
          author.update_column(:shelfari_url, authors_url)
          index = index + 1
        end

        index = 0
        tags = doc.css('.tags')
        if tags && tags[0]
          tags[0].children.each do |tag|
            name = tag.children[0]
            if name
              name = name.content
              children_url = tag.children[0].attr("href") rescue nil
              value = tag.children[0].attr("class")
              value.slice!("tag") rescue nil
              shelfari_tag = ShelfariTag.find_or_create_by(:name => name,
                                                           :url => children_url)
              ShelfariBooksTags.find_or_create_by(:shelfari_book_id => id,
                                                  :shelfari_tag_id => shelfari_tag.id,
                                                  :weight => value)
            else
              break
            end
          end
        end

        index = 0
        ebooks = doc.css('#WikiModule_SupplementalMaterial li')
        while ebooks && ebooks[index] != nil
          notes = ebooks[index].content
          ebook_url = ebooks[index].children[0].attr("href")
          name = book.name
          ebook = Ebook.find_or_create_by(:url => ebook_url, 
                                          :notes => notes, 
                                          :name => name)
          EbooksShelfariBooks.find_or_create_by(:ebook_id => ebook.id,
                                                :shelfari_book_id => id)
          index = index + 1
        end

        categories = doc.css('#WikiModule_Subjects li')
        index = 0
        parent = ShelfariCategory.first
        while categories && categories[index]!=nil
          tree_index = 3
          while categories[index].children[tree_index]!=nil
            category_name = categories[index].children[tree_index].content
            new_parent = parent.children.where(:name => category_name).first
            parent = new_parent unless new_parent.nil?
            tree_index = tree_index + 2
          end
          ShelfariBooksCategories.find_or_create_by(:shelfari_category_id => parent.id,
                                                    :shelfari_book_id => id)
          parent = ShelfariCategory.first
          index = index + 1
        end

        book.data_flag = true
        book.save
      end
    rescue Exception => e
      debugger
      puts "DEBUG #{id} #{book.url} #{e}"
      ELogger.log_info "DEBUG #{id} #{book.url} #{e}"
      # initialize_player
    end
  end

  def self.initialize_player
    # @small_beep = Audite.new
    # @long_beep = Audite.new
    # @burp = Audite.new
    # @success = Audite.new
    # @root = 'app/assets/audio/'
    # @success.load(@root+'success.mp3')
    # @long_beep.load(@root+'long_beep.mp3')
    # @small_beep.load(@root+'small_beep.mp3')
    # @burp.load(@root+'burp.mp3')
    # @success.start_stream
    # @success.load(@root+'success.mp3')
  end

  def detect_duplicate_children(category=ShelfariCategory.first.id)
    category = ShelfariCategory.find(category)
    children = category.children
    if children.count!=category.children.pluck(:name).uniq.count
      ELogger.log_info "category #{category.name} has duplicate children"
      puts "category #{category.name} has duplicate children"
    end
    if children.count > 0
      children.each do |sub_category|
        detect_duplicate_children sub_category.id
      end
    end
  end

  def delete_duplicate_categories(category=ShelfariCategory.first.id)
    category = ShelfariCategory.find category
    siblings = category.siblings
    children = category.children
    children.each do |sub_category|
      if siblings.pluck(:url).include? sub_category.url
        ELogger.log_info "FOUND DUPLICATES #{sub_category.name}"
        sub_category.destroy
      else
        delete_duplicate_categories sub_category.id
      end
    end
  end

  def self.get_authors
    begin
      base_url = "http://www.shelfari.com/authors/a"
      AuthorCrawlStatus.all.find_each do |page|
        puts page.page_number
        unless page.status
          url = base_url+page.page_number
          Resque.enqueue(ShelfariAuthorCrawlerWorker, url, page.page_number)
        end
      end
    rescue => e
      puts "Error #{e} get_authors"
      debugger
      ELogger.log_info "Error #{e} get_authors"
    end
  end

  def self.get_author_details(url, page_number)
    begin
      doc = Nokogiri::HTML(open(url))
      name = doc.css('.hover_title')
      name = name[0].content.gsub("\r","").gsub("\n","").gsub("(edit name/settings)","").strip
      puts "#{name}"
      overview = doc.css('#WikiModule_Overview p')[0].content rescue nil
      bio = doc.css('#WikiModule_Bio li')
      human_profile = HumanProfile.find_or_create_by(:name => name)
      author = Author.find_or_create_by(:human_profile_id => human_profile.id)

      legal_name = bio[0].content rescue nil
      birthdate = bio[1].content rescue nil
      birthplace = bio[2].content rescue nil
      nationality = bio[3].content rescue nil
      gender = bio[4].content rescue nil
      official_website = bio[5].content rescue nil
      date_of_death = bio[7].content rescue nil
      burial_location = bio[8].content rescue nil

      author.update_attributes(:legal_name => legal_name, 
                          :birthdate => birthdate,
                          :birthplace => birthplace,
                          :nationality => nationality,
                          :gender => gender,
                          :official_website => official_website,
                          :date_of_death => date_of_death,
                          :burial_location => burial_location,
                          :overview => overview)

      AuthorCrawlStatus.find_by(:page_number =>  page_number)
                       .update_column(:status, true)

    rescue Exception => e
      puts "Debug #{e} #{url} get_author_details"
      ELogger.log_info "Debug #{e} #{url} get_author_details"
    end
  end

end