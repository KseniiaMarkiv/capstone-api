source 'https://rubygems.org'
git_source(:github) { |repo| 'https://github.com/#{repo}.git' }

ruby '3.1.1'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails', branch: 'main'
gem 'rails', '~> 7.0.1'
gem 'pg'
gem 'pry-rails'
gem 'database_cleaner', '1.7'
# gem 'database_cleaner-mongoid'
gem 'pundit', '~> 2.2'
gem 'exifr', '~> 1.3', '>= 1.3.9'
gem 'mini_magick', '~> 4.11'
gem 'geokit-rails'

# The original asset pipeline for Rails [https://github.com/rails/sprockets-rails]
gem 'sprockets-rails'
# Use Sass to process CSS
gem 'sassc-rails'
gem 'terser', '~> 1.1', '>= 1.1.8'

# Use the Puma web server [https://github.com/puma/puma]
gem 'puma', '~> 5.6', '>= 5.6.4'

# Use JavaScript with ESM import maps [https://github.com/rails/importmap-rails]
gem 'importmap-rails'

# Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem 'turbo-rails'

# Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem 'stimulus-rails'

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem 'jbuilder'

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem 'kredis'

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
gem 'bcrypt'#, '~> 3.1.7'
gem 'mongo'
gem 'mongoid'#, git: 'https://github.com/mongodb/mongoid.git', branch: 'master'
gem 'httparty'
gem 'rack-cors'
gem 'rexml', '~> 3.2', '>= 3.2.5'
gem 'jquery-rails', '~> 4.5'
# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem 'image_processing', '~> 1.2'
gem 'devise'
gem 'devise_token_auth', '>= 1.2.0', git: "https://github.com/lynndylanhurley/devise_token_auth"
gem 'factory_bot_rails'
gem 'faker'
group :development do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', platforms: %i[mri mingw x64_mingw]
  # Use sqlite3 as the database for Active Record
  gem 'sqlite3', '~> 1.4'#, git: 'https://github.com/sparklemotion/sqlite3-ruby' # - for 1.3.13 version
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
  gem 'pry-byebug'
  gem 'launchy', '~> 2.5'
  gem 'poltergeist', '~> 1.18', '>= 1.18.1'
  gem 'simplecov', require: false
end
group :test do
  gem 'capybara', '3.34'
  gem 'mongoid-rspec'
  gem 'selenium-webdriver', '~> 4.0.0.alpha7'
  gem 'rspec-rails', '~> 6.0.0.rc1'
  gem 'webdrivers', '~> 4.0' #, require: false
end
group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem 'web-console'

  # Add speed badges [https://github.com/MiniProfiler/rack-mini-profiler]
  # gem 'rack-mini-profiler'

  gem 'awesome_print'
  gem 'coderay'
  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  gem 'spring'
end

gem 'rails_serve_static_assets'
# source 'https://rails-assets.org' do
# # source 'http://insecure.rails-assets.org' do
#   gem 'rails-assets-bootstrap'#, '~>3.3.7'
#   gem 'rails-assets-angular'#, '~>1.5.9'
#   gem 'rails-assets-angular-ui-router'#, '~>0.3.1'
#   gem 'rails-assets-angular-resource'#, '~>1.5.9'
# end
source 'https://rails-assets.org' do
  gem 'rails-assets-bootstrap', '5.1.3'
  gem 'rails-assets-angular', '1.5.9'
  gem 'rails-assets-angular-ui-router', '0.4.3'
  gem 'rails-assets-angular-resource', '1.5.9'
  gem 'rails-assets-ng-token-auth', '0.0.30'
  gem 'rails-assets-angular-cookie' #required by ng-token-auth
  gem 'rails-assets-ng-file-upload'
  gem 'rails-assets-ng-file-upload-shim'
  gem 'rails-assets-ui-cropper'
end
gem "matrix", "~> 0.4.2"
