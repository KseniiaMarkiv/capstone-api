require 'database_cleaner'
require 'database_cleaner/mongoid'


shared_context "db_cleanup" do |ar_strategy=:truncation|
  before(:all) do
    DatabaseCleaner[:mongoid].strategy = :deletion
    DatabaseCleaner[:active_record].strategy = ar_strategy
    DatabaseCleaner[:active_record].clean_with(:truncation)
    DatabaseCleaner[:mongoid].clean_with(:deletion)
  end
  after(:all) do
    DatabaseCleaner[:active_record].clean_with(:truncation)
    DatabaseCleaner[:mongoid].clean_with(:deletion)
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
    DatabaseCleaner.clean_with(:deletion)
  end
end
shared_context "db_clean_all" do
  before(:all) do
    DatabaseCleaner[:active_record].clean_with(:truncation)
  end
  after(:all) do
    DatabaseCleaner[:active_record].clean_with(:truncation)
  end
end
shared_context "db_cleanup_each" do |ar_strategy=:truncation|
  before(:all) do
    DatabaseCleaner[:mongoid].strategy = :deletion
    DatabaseCleaner[:active_record].strategy = ar_strategy
    DatabaseCleaner[:active_record].clean_with(:truncation)
    DatabaseCleaner[:mongoid].clean_with(:deletion)
  end
  after(:all) do
    DatabaseCleaner[:active_record].clean_with(:truncation)
    DatabaseCleaner[:mongoid].clean_with(:deletion)
  end
  before(:each) do
    DatabaseCleaner.start
  end
  after(:each) do
    DatabaseCleaner.clean
  end
end