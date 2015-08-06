ReadersDoor::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.cache_classes = true
  config.nlp_service = "http://52.11.182.15/"
  config.google_news_sources = "https://support.google.com/news/answer/40237?hl=en"
  config.blog_url = " https://public-api.wordpress.com/rest/v1.1/sites/literaturerun.wordpress.com/posts/?number=10&pretty=1&order=ASC&fields=title,date,short_URL,excerpt,discussion,like_count,featured_image,tags,is_reblogged,attachments&after="
  config.neo4j_url = "http://localhost:7474"
  config.community_bucket = "rd-images"
  config.user_bucket = "rd-images"
  config.news_bucket = "rd-images"
  config.google_public_key = ['AIzaSyBj9-R7iOj2lUuJovA9ITK_aPOtmdo3CPU','AIzaSyDbCyV9BqcDI8Hy0N_hE3mft7JMOB8n2Ro','AIzaSyBttf3q2dr-NfCP3BndIkZmq2P0WSaReSQ','AIzaSyDp2_Chh4EwJoivti1HPlgXj36HFuu1u18','AIzaSyAZEOl-HUtyjd2Lhsru3qRBXaXXC4mEF2w','AIzaSyD15mkYlsdQ7UoncOYfudpnCXRBm8iXw3I','AIzaSyBRYd4EpgLR5Q0Lte1S8lFU1dnbo_cqm0U','AIzaSyCbPFLI9t7p3N0u9mkiTpxQfK75Rm5ZcKs']
  config.image_service = "http://54.149.23.150"
  config.feed_service = "http://161.202.19.237"
  config.neo4j_server_port = 7474
  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both thread web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Enable Rack::Cache to put a simple HTTP cache in front of your application
  # Add `rack-cache` to your Gemfile before enabling this.
  # For large-scale production use, consider using a caching reverse proxy like nginx, varnish or squid.
  # config.action_dispatch.rack_cache = true

  # Disable Rails's static asset server (Apache or nginx will already do this).
  config.serve_static_assets = true

  # Compress JavaScripts and CSS.
  config.assets.js_compressor = :uglifier
  # config.assets.css_compressor = :sass

  # Do not fallback to assets pipeline if a precompiled asset is missed.
  config.assets.compile = true

  # Generate digests for assets URLs.
  config.assets.digest = true
  config.mandrill_mailer.default_url_options = { :host => 'localhost' }

  # Version of your assets, change this if you want to expire all your assets.
  config.assets.version = '1.0'

  # Specifies the header that your server uses for sending files.
  # config.action_dispatch.x_sendfile_header = "X-Sendfile" # for apache
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect' # for nginx

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  # config.force_ssl = true

  # Set to :debug to see everything in the log.
  config.log_level = :info

  # Prepend all log lines with the following tags.
  # config.log_tags = [ :subdomain, :uuid ]

  # Use a different logger for distributed setups.
  # config.logger = ActiveSupport::TaggedLogging.new(SyslogLogger.new)

  # Use a different cache store in production.
  # config.cache_store = :mem_cache_store

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.action_controller.asset_host = "http://assets.example.com"

  # Precompile additional assets.
  # application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
  # config.assets.precompile += %w( search.js )

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  # config.action_mailer.raise_delivery_errors = false

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation can not be found).
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners.
  config.active_support.deprecation = :notify

  # Disable automatic flushing of the log to improve performance.
  # config.autoflush_log = false

  # Use default logging formatter so that PID and timestamp are not suppressed.
  config.log_formatter = ::Logger::Formatter.new
  config.home = "http://www.readersdoor.com/"
  config.assets.precompile += [
    'basic.css', 
    'basic_less.css',
    'full_control.css'
  ]

  config.search_service_url = "http://119.81.63.26"
end