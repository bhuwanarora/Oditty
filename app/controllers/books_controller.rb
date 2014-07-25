class BooksController < ApplicationController
  before_action :set_book, only: [:show, :edit, :update, :destroy]

  # GET /books
  # GET /books.json
  def index
    @books = Book.all.limit(10)
  end

  # GET /books/1
  # GET /books/1.json
  def show
  end

  # GET /books/new
  def new
    @book = Book.new
  end

  def grids
    neo = Neography::Rest.new

    if params[:grid_id]
      book_ids = params[:book_ids].gsub("[", "").gsub("]", "").split(",") rescue ""
      id_string = ""
      clause = "MATCH (bg:BookGrid)-[r:RelatedBooks]->(:Book) WHERE ID(bg)="+params[:grid_id]+" DELETE r"
      neo.execute_query clause
      if book_ids.present?
        for book_id in book_ids
          if book_id.present?
            if id_string.present?
              id_string = id_string + " OR ID(b) = " + book_id
            else
              id_string = id_string + " AND (ID(b) = " + book_id
            end
          end
        end
        id_string = id_string + ")"
        if params[:status] == "on"
          clause = "MATCH (b:Book), (bg:BookGrid) WHERE ID(bg)="+params[:grid_id]+id_string+" SET bg.status = 1 CREATE UNIQUE (bg)-[:RelatedBooks]->(b)"
        else
          clause = "MATCH (b:Book), (bg:BookGrid) WHERE ID(bg)="+params[:grid_id]+id_string+" SET bg.status = 0 CREATE UNIQUE (bg)-[:RelatedBooks]->(b)"
        end
      else
        if params[:status] == "on"
          clause = "MATCH (bg:BookGrid) WHERE ID(bg)="+params[:grid_id]+id_string+" SET bg.status = 1"
        else
          clause = "MATCH (bg:BookGrid) WHERE ID(bg)="+params[:grid_id]+id_string+" SET bg.status = 0"
        end
      end
      puts clause.blue.on_red
      neo.execute_query clause
    end

    clause = "MATCH (bg:BookGrid) OPTIONAL MATCH (bg)-[:RelatedBooks]->(b:Book) RETURN bg.name, bg.timestamp, ID(bg), COLLECT(b.title), bg.status, COLLECT(ID(b))"
    puts clause.blue.on_red
    @grids = neo.execute_query(clause)["data"]
  end

  def labels
    neo = Neography::Rest.new

    if params[:label_id]
      book_ids = params[:book_ids].gsub("[", "").gsub("]", "").split(",") rescue ""
      id_string = ""
      clause = "MATCH (l:Label)-[r:BookmarkedOn]->(:Book) WHERE ID(l)="+params[:label_id]+" DELETE r"
      neo.execute_query clause
      if book_ids.present?
        for book_id in book_ids
          if book_id.present?
            if id_string.present?
              id_string = id_string + " OR ID(b) = " + book_id
            else
              id_string = id_string + " AND (ID(b) = " + book_id
            end
          end
        end
        id_string = id_string + ")"
        if params[:status] == "on"
          clause = "MATCH (b:Book), (l:Label) WHERE ID(l)="+params[:label_id]+id_string+" SET l.status = 1 CREATE UNIQUE (l)-[:BookmarkedOn]->(b)"
        else
          clause = "MATCH (b:Book), (l:Label) WHERE ID(l)="+params[:label_id]+id_string+" SET l.status = 0 CREATE UNIQUE (l)-[:BookmarkedOn]->(b)"
        end
      else
        if params[:status] == "on"
          clause = "MATCH (l:Label) WHERE ID(l)="+params[:label_id]+id_string+" SET l.status = 1"
        else
          clause = "MATCH (l:Label) WHERE ID(l)="+params[:label_id]+id_string+" SET l.status = 0"
        end
      end
      puts clause.blue.on_red
      neo.execute_query clause
    end

    clause = "MATCH (l:Label) OPTIONAL MATCH (l)-[:BookmarkedOn]->(b:Book) RETURN l.name, l.timestamp, ID(l), COLLECT(b.title), l.status, COLLECT(ID(b))"
    puts clause.blue.on_red
    @labels = neo.execute_query(clause)["data"]
  end

  def trends
    neo = Neography::Rest.new

    if params[:trending_id]
      book_ids = params[:book_ids].gsub("[", "").gsub("]", "").split(",") rescue ""
      id_string = ""
      clause = "MATCH (t:Trending)-[r:RelatedBooks]->(:Book) WHERE ID(t)="+params[:trending_id]+" DELETE r"
      neo.execute_query clause
      if book_ids.present?
        for book_id in book_ids
          if book_id.present?
            if id_string.present?
              id_string = id_string + " OR ID(b) = " + book_id
            else
              id_string = id_string + " AND (ID(b) = " + book_id
            end
          end
        end
        id_string = id_string + ")"
        if params[:status] == "on"
          clause = "MATCH (b:Book), (t:Trending) WHERE ID(t)="+params[:trending_id]+id_string+" SET t.status = 1 CREATE UNIQUE (t)-[:RelatedBooks]->(b)"
        else
          clause = "MATCH (b:Book), (t:Trending) WHERE ID(t)="+params[:trending_id]+id_string+" SET t.status = 0 CREATE UNIQUE (t)-[:RelatedBooks]->(b)"
        end
      else
        if params[:status] == "on"
          clause = "MATCH (t:Trending) WHERE ID(t)="+params[:trending_id]+id_string+" SET t.status = 1"
        else
          clause = "MATCH (t:Trending) WHERE ID(t)="+params[:trending_id]+id_string+" SET t.status = 0"
        end
      end
      puts clause.blue.on_red
      neo.execute_query clause
    end

    clause = "MATCH (t:Trending) OPTIONAL MATCH (t)-[:RelatedBooks]->(b:Book) RETURN t.name, t.timestamp, ID(t), COLLECT(b.title), t.status, COLLECT(ID(b))"
    puts clause.blue.on_red
    @trends = neo.execute_query(clause)["data"]

  end

  def search_book
    tags = Api::V0::SearchApi.search_books params[:q]
    render :json => tags, :status => 200
  end

  # GET /books/1/edit
  def edit
  end

  def count
    neo = Neography::Rest.new
    tags = params[:q]
    # count = neo.execute_query("MATCH (b:Book)-[:Belongs_to]->(g:Genre) WHERE g.name=''")
    render :json => {:count => 1}, :status => 200
  end

  def thumbs
    @requests = ThumbRequest.all
  end

  # POST /books
  # POST /books.json
  def create
    @book = Book.new(book_params)

    respond_to do |format|
      if @book.save
        format.html { redirect_to @book, notice: 'Book was successfully created.' }
        format.json { render action: 'show', status: :created, location: @book }
      else
        format.html { render action: 'new' }
        format.json { render json: @book.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /books/1
  # PATCH/PUT /books/1.json
  def update
    respond_to do |format|
      if @book.update(book_params)
        format.html { redirect_to @book, notice: 'Book was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @book.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /books/1
  # DELETE /books/1.json
  def destroy
    @book.book_identifier.delete rescue nil
    @book.destroy
    respond_to do |format|
      format.html { redirect_to books_url }
      format.json { head :no_content }
    end
  end

  def search
    render 'search'
  end

  def find_by_isbn
    # @isbn_number = params[:book]
    # log_searched_query
    # @book = Book.find_by_isbn @isbn_number
    @results = Book.search(params[:book])
    render 'search'
  end

  def remove_tag
    set_book
    @tag = Tag.where(:name => params[:tag]).first
    @tags = @book.tags
    @tags = @tags - [@tag]
    @book.tags = @tags
    if @book.save
      handle_queue(ProcessTag::DELETE)
      log_remove_tag
      render :json => {:message => "Success"}, :status => 200
    else
      render :json => {:message => "Error"}, :status => 500
    end
  end

  def add_tag
    set_book
    @tag = Tag.where(:name => params[:tag]).first
    @tags = @book.tags
    @tags = @tags + [@tag]
    @book.tags = @tags
    if @book.save
      handle_queue(ProcessTag::ADD)
      log_add_tag
      render :json => {:message => "Success"}, :status => 200
    else
      render :json => {:message => "Error"}, :status => 500
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_book
      @book = Book.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def book_params
      params[:book]
    end

end
