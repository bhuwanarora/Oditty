class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]

  # GET /users
  # GET /users.json
  def index
    neo = Neography::Rest.new
    if params[:id].present?
      if params[:active].present?
        clause = "MATCH (u:User) WHERE ID(u)="+params[:id].to_s+" SET u.active=true "
      else
        clause = "MATCH (u:User) WHERE ID(u)="+params[:id].to_s+" SET u.active=false "
      end

      puts clause.blue.on_red
      neo.execute_query clause
    end

    clause = "MATCH (u:User) RETURN u, ID(u)"
    @users = neo.execute_query(clause)["data"]
    render :index
  end

  # GET /users/1
  # GET /users/1.json
  def show
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  def test
    render 'test_layout'
  end

  

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render action: 'show', status: :created, location: @user }
      else
        format.html { render action: 'new' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: 'User was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { head :no_content }
    end
  end

  def logout
    session[:email] = nil
    @user = nil
    render 'login'
  end

  def login
    render 'login'
  end

  def invalid_user
    @message = "Invalid Reader's Door User Account."
    render 'invalid'
  end

  def test_layout

  end

  def verify
    @neo = Neography::Rest.new
    clause = "MATCH (user:User) WHERE user.email=\""+params[:e]+"\" AND user.verification_token=\""+params[:p]+"\" SET user.verified = true RETURN user"
    puts clause.blue.on_red
    user = @neo.execute_query clause
    if user["data"]
      @message = Constants::EmailConfirmed
    else
      @message = Constants::EmailConfirmationFailed
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params[:user]
    end
end
