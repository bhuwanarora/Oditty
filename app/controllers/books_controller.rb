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

  # GET /books/1/edit
  def edit
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
