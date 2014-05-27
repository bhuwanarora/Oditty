class HumanProfilesController < ApplicationController
  before_action :set_human_profile, only: [:show, :edit, :update, :destroy]

  # GET /human_profiles
  # GET /human_profiles.json
  def index
    @human_profiles = HumanProfile.all
  end

  # GET /human_profiles/1
  # GET /human_profiles/1.json
  def show
  end

  # GET /human_profiles/new
  def new
    @human_profile = HumanProfile.new
  end

  # GET /human_profiles/1/edit
  def edit
  end

  # POST /human_profiles
  # POST /human_profiles.json
  def create
    @human_profile = HumanProfile.new(human_profile_params)

    respond_to do |format|
      if @human_profile.save
        format.html { redirect_to @human_profile, notice: 'Human profile was successfully created.' }
        format.json { render action: 'show', status: :created, location: @human_profile }
      else
        format.html { render action: 'new' }
        format.json { render json: @human_profile.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /human_profiles/1
  # PATCH/PUT /human_profiles/1.json
  def update
    respond_to do |format|
      if @human_profile.update(human_profile_params)
        format.html { redirect_to @human_profile, notice: 'Human profile was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @human_profile.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /human_profiles/1
  # DELETE /human_profiles/1.json
  def destroy
    @human_profile.destroy
    respond_to do |format|
      format.html { redirect_to human_profiles_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_human_profile
      @human_profile = HumanProfile.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def human_profile_params
      params[:human_profile]
    end
end
