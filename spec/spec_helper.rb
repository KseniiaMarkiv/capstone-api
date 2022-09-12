# See https://rubydoc.info/gems/rspec-core/RSpec/Core/Configuration
require "awesome_print"
require 'mongoid-rspec'
require 'capybara'
require 'capybara/rspec'
require 'webdrivers'
require 'selenium/webdriver'
require 'rexml/document'
require_relative 'support/database_cleaners'
require_relative 'support/api_bar_helper'
require_relative 'support/api_helper'
require_relative 'support/ui_helper'

require 'simplecov'
require 'exifr/jpeg'

browser = :firefox

Capybara.register_driver :selenium do |app|
  if browser == :chrome
    require 'webdrivers/chromedriver'
    Selenium::WebDriver::Chrome.path = '/mnt/c/WebDriver/bin/chromedriver.exe'
    Capybara::Selenium::Driver.new(app, browser: :chrome)
  else
    require 'webdrivers/geckodriver'
    Selenium::WebDriver::Firefox.path = '/mnt/c/WebDriver/bin/geckodriver.exe'
    # Capybara::Selenium::Driver.new(app, browser: :firefox)
    #http://stackoverflow.com/questions/20009266/selenium-testing-with-geolocate-firefox-keeps-turning-it-off
    profile = Selenium::WebDriver::Firefox::Profile.new
    profile["geo.prompt.testing"]=true
    profile["geo.prompt.testing.allow"]=true
    Capybara::Selenium::Driver.new(app, :browser=>:firefox, :profile=>profile)
    # driver = Selenium::WebDriver.for :firefox, :profile => profile
  end
end


require 'capybara/poltergeist'
# Set the default driver 
Capybara.configure do |config|
  config.default_driver = :rack_test
  # used when :js=>true
  config.javascript_driver = :selenium
end
Capybara.javascript_driver = :selenium
Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new( app,
    js_errors: false,
    phantomjs_logger: StringIO.new,
# logger: STDERR
    )
end

RSpec.configure do |config|
  config.include Mongoid::Matchers, orm: :mongoid
  config.include ApiBarHelper, type: :request
  config.include ApiHelper, type: :request
  config.include UiHelper, type: :feature

  config.include Devise::Test::IntegrationHelpers, type: :request
  config.include Warden::Test::Helpers, type: :request


  config.infer_spec_type_from_file_location!
  # this way isn't recommended cuz will be everywhere - the same way
      # and we have chance of choice our own way
  # config.include_context "db_cleanup", :type => :model
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end
  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end 
  config.shared_context_metadata_behavior = :apply_to_host_groups
end
