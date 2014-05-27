json.array!(@human_profiles) do |human_profile|
  json.extract! human_profile, 
  json.url human_profile_url(human_profile, format: :json)
end
