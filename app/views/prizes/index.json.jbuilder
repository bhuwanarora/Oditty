json.array!(@prizes) do |prize|
  json.extract! prize, 
  json.url prize_url(prize, format: :json)
end
