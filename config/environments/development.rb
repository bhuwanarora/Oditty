ReadersDoor::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations
  # config.active_record.migration_error = :page_load
  config.mandrill_mailer.default_url_options = { :host => 'localhost' }

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true
  config.home = "http://127.0.0.1:3000/"
  config.image_service = "http://52.10.230.9"
  config.nlp_service = "http://52.10.10.235/"
  config.google_news_sources = "https://support.google.com/news/answer/40237?hl=en"
  config.blog_url = " https://public-api.wordpress.com/rest/v1.1/sites/literaturerun.wordpress.com/posts/?number=10&pretty=1&order=ASC&fields=title,date,short_URL,excerpt,discussion,like_count,featured_image,tags,is_reblogged,attachments&after="
  config.neo4j_url = "http://localhost:7474"
  config.community_bucket = "rd-arjun"
  config.user_bucket = "rd-arjun"
  config.news_bucket = "rd-arjun"
  config.google_public_key = 'AIzaSyDPDaicSFnNjbYqviSzne1hDsKkPXc3mK0'
  config.neo4j_server_port = 3232
  config.feed_service = "http://161.202.19.237"
end