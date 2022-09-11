require 'database_cleaner'
require 'database_cleaner/mongoid'


shared_context "db_cleanup" do |ar_strategy=:truncation|
  before(:all) do
    DatabaseCleaner[:mongoid].strategy = :deletion, {:except => %w(locations)}
    DatabaseCleaner[:active_record].strategy = ar_strategy
    DatabaseCleaner[:active_record].clean_with(:truncation)
    DatabaseCleaner[:mongoid].clean_with(:deletion, {:except => %w(locations)})
  end
  after(:all) do
    DatabaseCleaner[:active_record].clean_with(:truncation, {:except => %w(locations)})
    DatabaseCleaner[:mongoid].clean_with(:deletion, {:except => %w(locations)})
  end
end
  shared_context "db_scope" do
  before(:each) do
    DatabaseCleaner.start
  end
  after(:each) do
    DatabaseCleaner.clean
  end
end
shared_context "db_clean_after" do
  after(:all) do
    DatabaseCleaner.clean_with(:deletion, {:except => %w(locations)})
  end
end
shared_context "db_clean_all" do
  before(:all) do
    DatabaseCleaner[:active_record].clean_with(:truncation, {:except => %w(locations)})
  end
  after(:all) do
    DatabaseCleaner[:active_record].clean_with(:truncation, {:except => %w(locations)})
  end
end
shared_context "db_cleanup_each" do |ar_strategy=:truncation|
  before(:all) do
    DatabaseCleaner[:mongoid].strategy = :deletion, {:except => %w(locations)}
    DatabaseCleaner[:active_record].strategy = ar_strategy
    DatabaseCleaner[:active_record].clean_with(:truncation, {:except => %w(locations)})
    DatabaseCleaner[:mongoid].clean_with(:deletion, {:except => %w(locations)})
  end
  after(:all) do
    DatabaseCleaner[:active_record].clean_with(:truncation, {:except => %w(locations)})
    DatabaseCleaner[:mongoid].clean_with(:deletion, {:except => %w(locations)})
  end
  before(:each) do
    DatabaseCleaner.start
  end
  after(:each) do
    Capybara.reset_sessions!  if self.class.metadata[:js] 
    #page.driver.clear_memory_cache
    DatabaseCleaner.clean
  end
end