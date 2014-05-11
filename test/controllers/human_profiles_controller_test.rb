require 'test_helper'

class HumanProfilesControllerTest < ActionController::TestCase
  setup do
    @human_profile = human_profiles(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:human_profiles)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create human_profile" do
    assert_difference('HumanProfile.count') do
      post :create, human_profile: {  }
    end

    assert_redirected_to human_profile_path(assigns(:human_profile))
  end

  test "should show human_profile" do
    get :show, id: @human_profile
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @human_profile
    assert_response :success
  end

  test "should update human_profile" do
    patch :update, id: @human_profile, human_profile: {  }
    assert_redirected_to human_profile_path(assigns(:human_profile))
  end

  test "should destroy human_profile" do
    assert_difference('HumanProfile.count', -1) do
      delete :destroy, id: @human_profile
    end

    assert_redirected_to human_profiles_path
  end
end
