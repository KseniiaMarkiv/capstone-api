# See https://rubydoc.info/gems/rspec-core/RSpec/Core/Configuration
require 'mongoid-rspec'
require_relative 'support/database_cleaners'
require_relative 'helpers/foos_helper_spec.rb'

RSpec.configure do |config|
  config.include Mongoid::Matchers, :orm => :mongoid
  config.include ApiHelper, :type=>:request
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
