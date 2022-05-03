# See https://rubydoc.info/gems/rspec-core/RSpec/Core/Configuration
require 'mongoid-rspec'
require 'capybara'
require 'capybara/rspec'
require 'webdrivers'
require 'selenium/webdriver'
require 'rexml/document'
require_relative 'support/database_cleaners'
require_relative 'support/api_helper'
require 'simplecov'

browser = :firefox
Selenium::WebDriver::Chrome::Service.driver_path = 'C:\WebDriver\bin\chromedriver.exe'
Selenium::WebDriver::Firefox::Service.driver_path = 'C:\WebDriver\bin\geckodriver.exe'
Capybara.register_server :selenium do |app|
  if browser == :chrome
    options = Selenium::WebDriver::Options.chrome
    Selenium::WebDriver.for :chrome, capabilities: options
    Capybara::Selenium::Driver.new(app, browser: :chrome)
  else
    options = Selenium::WebDriver::Options.firefox #(marionette: false)
    driver = Selenium::WebDriver.for :firefox, capabilities: options
    driver.quit
    # Selenium::WebDriver.for :firefox, capabilities: options
    # Capybara::Selenium::Driver.new(app, browser: :firefox, capabilities: options)
  end
end

require 'capybara/poltergeist'
# Set the default driver 
Capybara.configure do |config|
  config.default_driver = :rack_test
  # used when :js=>true
  config.javascript_driver = :selenium
end
#Capybara.javascript_driver = :selenium
Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new( app,
    js_errors: false,
    phantomjs_logger: StringIO.new,
# logger: STDERR
    )
end

RSpec.configure do |config|
  config.include Mongoid::Matchers, orm: :mongoid
  config.include ApiHelper, type: :request
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
