class CategoriesController < ApplicationController
  before_action :set_category, only: [:show, :edit, :update, :destroy]

  # GET /categories
  # GET /categories.json
  def index
    @categories = Category.all
    render 'index', :status => 200, :layout => false
  end

  # GET /categories/1
  # GET /categories/1.json
  def show
    render 'show', :status => 200, :layout => false
  end

  # GET /categories/new
  def new
    @category = Category.new
    render 'new', :status => 200, :layout => false
  end

  # GET /categories/1/edit
  def edit
    render 'edit', :status => 200, :layout => false
  end

  # POST /categories
  # POST /categories.json
  def create
    parent_id = params[:parent_id]
    if parent_id
      @category = Category.new(category_params.except(:edge))
      @edge = Edge.new(:weight => category_params[:edge][:weight])
      @parent_category = Category.find(parent_id)
      if @parent_category.children.create category_params.except(:edge)
        @category.id = @parent_category.children.where(:name => category_params[:name].upcase).first.id
        @edge.update_attributes(:start_node_id => parent_id.to_i, :end_node_id => @category.id)
        render :json => {:message => 'Category was successfully created.', :parent_id => parent_id, :id => @category.id, :name => @category.name}, :status => 200, :layout => false
      else
        render :json => {:message => 'Category failed to create.'}, :status => 400, :layout => false
      end
    end
  end

  # PATCH/PUT /categories/1
  # PATCH/PUT /categories/1.json
  def update
    unless @category.name == "ROOT"
      if @category.update(category_params)
        render 'show', :status => 200, :layout => false, notice: 'Category was successfully created.'
      else
        render :json => {:message => "Error in updating category"}, notice: @category.errors, :layout => false, :status => 400
      end
    else
      render :json => {:message => "Root can't be edited."}, :layout => false, :status => 400
    end
  end

  def show_tree
    @root = ShelfariCategory.where(:name => params[:name]).first rescue ShelfariCategory.where(:name => "ROOT").first
    render 'show_tree'
  end

  def new_child_category
    @parent_id = params[:parent_id]
    @category = Category.new
    @parent_category = Category.find(@parent_id)
    render 'new_child', :layout => false, :status => 200
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_category
      @category = Category.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def category_params
      params[:category]
    end

end
