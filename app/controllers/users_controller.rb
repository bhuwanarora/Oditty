class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  

  # GET /users
  # GET /users.json
  def index
    neo = Neography::Rest.new
    clause = "MATCH (u:User) OPTIONAL MATCH (u)-[:FacebookAuth]->(f) OPTIONAL MATCH (u)-[:Likes]->(l) OPTIONAL MATCH p=(u)-[:Ego*..]->(friend:User) WITH DISTINCT(friend) as friend, u, f, l RETURN DISTINCT(u), f, COLLECT(l.name), ID(u), COLLECT(friend.email), COLLECT(friend.name), COLLECT(friend.thumb)"


    
    @users = neo.execute_query(clause)["data"]
    render :index
  end

  def activate
    begin
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
      render :json => {:message => "Success"}, :status => 200
    rescue Exception => e
      render :json => {:message => e.to_s}, :status => 500
    end
  end

  def clear_data
    begin
      neo = Neography::Rest.new

      clause = "MATCH (a)-[r:FeedNext]->(b) WHERE a <> b DELETE r"
      puts "Feednext...".green
      neo.execute_query clause

      clause = "MATCH (a)-[r:Ego]->(b) DELETE r"
      puts "Ego...".green
      neo.execute_query clause

      clause = "MATCH (a)-[r:BookFeed]->(b) WHERE a <> b DELETE r"
      puts "Bookfeed...".green
      neo.execute_query clause

      clause = "MATCH (:User)-[r1:RatingAction]->(r2:RatingNode)-[r3:Rate]->(:Book) DELETE r1, r2, r3"
      puts "Rating...".green
      neo.execute_query clause    

      clause = "MATCH (:User)-[r1:TimingAction]->(r2:TimingNode)-[r3:Timer]->(:Book) DELETE r1, r2, r3"
      puts "Timing...".green
      neo.execute_query clause

      clause = "MATCH (:User)-[r1:Labelled]-(r2:Label)-[r3:BookmarkedOn]->(r4:BookmarkNode)-[r5:BookmarkAction]-(:Book) DELETE r3, r4, r5"
      puts "Bookmark...".green
      neo.execute_query clause

      clause = "MATCH (:User)-[r1:MarkAsReadAction]->(r2:MarkAsReadNode)-[r3:MarkAsRead]->(:Book) DELETE r1, r2, r3"
      puts "MarkAsRead...".green
      neo.execute_query clause

      clause = "MATCH (:User)-[r1:Commented]->(r2:Tweet)-[r3:CommentedOn]->(:Book) DELETE r1, r2, r3"
      puts "Comment...".green
      neo.execute_query clause

      clause = "MATCH (:User)-[r1:RecommendedTo]->()-[r2:RecommendedAction]->(r3:RecommendNode)-[r4:Recommended]->() DELETE r1, r2, r3, r4"
      puts "Recommended...".green
      neo.execute_query clause

      # clause = " MATCH (:User)-[r1:DataEdit]->(r2:ThumbRequest)-[r3:DataEditRequest]->(:Book) DELETE r1, r2, r3"

      clause = "MATCH  (b:Book) CREATE UNIQUE (b)-[:BookFeed]->(b)"
      puts "Create bookfeed...".green
      neo.execute_query clause

      clause = "MATCH (u:User) CREATE UNIQUE (u)-[:FeedNext]->(u) CREATE UNIQUE (u)-[:Ego{user_id:ID(u)}]->(u) SET u.total_count = 0, u.bookmark_count = 0, u.book_read_count = 0, u.rating_count = 0"
      puts "handle user...".green
      neo.execute_query clause
      render :json => {:message => "Success"}, :status => 200
    rescue Exception => e
      render :json => {:message => e.to_s}, :status => 500
    end
  end

  def feedbacks
    neo = Neography::Rest.new
    clause = "MATCH (u:User)-[:GaveFeedback]->(f:Feedback) RETURN ID(u), ID(f), u.name, f.feedback_text, f.timestamp, f.status"
    @feedbacks = neo.execute_query(clause)["data"]
  end

  def change_feedback_status
    begin
      neo = Neography::Rest.new
      clause = "MATCH (f:Feedback) WHERE ID(f)="+params[:id].to_s+" SET f.status="+params[:status].to_s
      neo.execute_query clause
      render :json => {:message => "Success"}, :status => 200
    rescue Exception => e
      render :json => {:message => e.to_s}, :status => 500
    end
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
    render :layout => "clean"
  end

  def recover_password
    @neo = Neography::Rest.new
    clause = "MATCH (user:User) WHERE user.email=\""+params[:e]+"\" AND user.password_token=\""+params[:p]+"\"  RETURN ID(user)"
    puts clause.blue.on_red
    user = @neo.execute_query clause
    if user["data"].present?
      @user_exists = true 
      @user_id = user["data"][0][0]
    else
      @user_exists = false
      @message = Constants::InvalidLink
    end
    render :layout => "clean"
  end

  def save_password
    begin
      @neo = Neography::Rest.new
      clause = "MATCH (user:User) WHERE ID(user)="+params[:id].to_s+" SET user.password=\""+params[:p]+"\"  RETURN user"
      puts clause.blue.on_red
      user = @neo.execute_query clause
      render :json => {:message => Constants::PasswordChangedSuccess}, :status => 200
    rescue Exception => e
      render :json => {:message => Constants::PasswordChangedFailure}, :status => 500
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
