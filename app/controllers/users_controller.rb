class UsersController < ApplicationController
  # before_action :set_user, only: [:show, :edit, :update, :destroy]
  

  # GET /users
  # GET /users.json
    def index
        neo = Neography::Rest.new
        if params[:t]
            time = Time.strptime(params[:t], "%Y-%m-%d")
            @timestamp = params[:t]
        else
            time = Time.new
            @timestamp = "#{time.year}-#{time.month}-#{time.day}"
        end
        clause = " MATCH (user:User) WHERE user.last_login = \"" + @timestamp + "\" OPTIONAL MATCH (user)-[:FacebookAuth]->(facebook_auth) WITH DISTINCT(user) as user, facebook_auth " + User.return_group(User.basic_info, "user.email as email ", "facebook_auth")
    
        @users = clause.execute
        render :index
    end

    def all
        id = params[:id]
        if id
            clause = User.new(id).get_basic_info + ", user.email AS email, user.password AS password "
            @active_user = clause.execute[0]
        end

        clause = User.match + User.return_group(User.basic_info + ", user.email AS email, user.fb_id AS fb_id")
        @users = clause.execute
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

                clause.execute
            end

            clause = "MATCH (u:User) RETURN u, ID(u)"
            @users = clause.execute
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
            clause.execute

            clause = "MATCH (a)-[r:Ego]->(b) DELETE r"
            puts "Ego...".green
            clause.execute

            clause = "MATCH (a)-[r:BookFeed]->(b) WHERE a <> b DELETE r"
            puts "Bookfeed...".green
            clause.execute

            clause = "MATCH (:User)-[r1:RatingAction]->(r2:RatingNode)-[r3:Rate]->(:Book) DELETE r1, r2, r3"
            puts "Rating...".green
            clause.execute    

            clause = "MATCH (:User)-[r1:TimingAction]->(r2:TimingNode)-[r3:Timer]->(:Book) DELETE r1, r2, r3"
            puts "Timing...".green
            clause.execute

            clause = "MATCH (:User)-[r1:Labelled]-(r2:Label)-[r3:BookmarkedOn]->(r4:BookmarkNode)-[r5:BookmarkAction]-(:Book) DELETE r3, r4, r5"
            puts "Bookmark...".green
            clause.execute

            clause = "MATCH (:User)-[r1:MarkAsReadAction]->(r2:MarkAsReadNode)-[r3:MarkAsRead]->(:Book) DELETE r1, r2, r3"
            puts "MarkAsRead...".green
            clause.execute

            clause = "MATCH (:User)-[r1:Commented]->(r2:Tweet)-[r3:CommentedOn]->(:Book) DELETE r1, r2, r3"
            puts "Comment...".green
            clause.execute

            clause = "MATCH (:User)-[r1:RecommendedTo]->()-[r2:RecommendedAction]->(r3:RecommendNode)-[r4:Recommended]->() DELETE r1, r2, r3, r4"
            puts "Recommended...".green
            clause.execute

            # clause = " MATCH (:User)-[r1:DataEdit]->(r2:ThumbRequest)-[r3:DataEditRequest]->(:Book) DELETE r1, r2, r3"

            clause = "MATCH  (b:Book) CREATE UNIQUE (b)-[:BookFeed]->(b)"
            puts "Create bookfeed...".green
            clause.execute

            clause = "MATCH (u:User) CREATE UNIQUE (u)-[:FeedNext]->(u) CREATE UNIQUE (u)-[:Ego{user_id:ID(u)}]->(u) SET u.total_count = 0, u.bookmark_count = 0, u.book_read_count = 0, u.rating_count = 0"
            puts "handle user...".green
            clause.execute
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
            clause.execute
            render :json => {:message => "Success"}, :status => 200
        rescue Exception => e
            render :json => {:message => e.to_s}, :status => 500
        end
    end

    def show
    end

    # GET /users/new
    def new
        @user = User.new
    end

    # GET /users/1/edit
    def edit
        id = params[:id]
        clause = User.new(id).get_basic_info
        @active_user = clause.execute[0]
        render :json => {}
    end

    def test
        render 'test_layout'
    end

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

    def update
        first_name = params[:first_name]
        last_name = params[:last_name]
        email = params[:email]
        image_url = params[:image_url]
        clause = User.new(params[:id]).match + User::Info.set_first_name(first_name) + User::Info.set_last_name(last_name) + User::Info.set_email(email) + User::Info.set_thumb(image_url)
        clause.execute
        redirect_to :all_users
    end

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
        @message = "Invalid ReadersDoor User Account."
        render 'invalid'
    end

    def test_layout

    end

    def verify
        @message = Api::V0::UserApi.verify(params)
        render :layout => "backend"
    end

    def recover_password
        info = Api::V0::UserApi.recover_password(params[:e])
        @user_id = info["user_id"]
        @user_exists = info["user_exists"]
        @message = info["message"]
        render :layout => "backend"
    end

    def save_password
        begin
            @neo = Neography::Rest.new
            clause = "MATCH (user:User) WHERE ID(user)="+params[:id].to_s+" SET user.password=\""+params[:p]+"\"  RETURN user"
            user = clause.execute
            render :json => {:message => Constant::StatusMessage::PasswordChangedSuccess}, :status => 200
        rescue Exception => e
            render :json => {:message => Constant::StatusMessage::PasswordChangedFailure}, :status => 500
        end
    end

    def save_password
        begin
            @neo = Neography::Rest.new
            clause = "MATCH (user:User) WHERE ID(user)="+params[:id].to_s+" SET user.password=\""+params[:p]+"\"  RETURN user"
            user = clause.execute
            render :json => {:message => Constant::StatusMessage::PasswordChangedSuccess}, :status => 200
        rescue Exception => e
            render :json => {:message => Constant::StatusMessage::PasswordChangedFailure}, :status => 500
        end
    end

    private
    # Use callbacks to share common setup or constraints between actions.
    # def set_user
        # @user = User.find(params[:id])
    # end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
        params[:user]
    end
end
