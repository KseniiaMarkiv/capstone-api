require 'rails_helper'
Capybara.app_host = 'http://127.0.0.1:3000'

# ----- diference of methods in Capybara is wait download of element or not -----
# ----- in many Capybara methods doesn't need use .using_wait_time method 

RSpec.describe 'Mainpages', type: :feature do
  # let(:valid_attributes) {
  #   # skip("Add a hash of attributes valid for your model")
  #   FactoryBot.attributes_for(:foo)
  # }
  include_context 'db_cleanup_each', :transaction
  feature 'when the main page is accessed' do
    before(:each) do
      # binding.pry
      visit root_path
    end
    scenario 'displays the index.html launch page' do
      # save_and_open_page
      # save_and_ open_screenshot   - если мы хотим посмотреть
      # expect(page).to have_content('Hello (from app/views/ui/index.html.erb)')
      # binding.pry
      # expect(page).to have_selector 'h1', text: 'Hello'
      expect(page).to have_xpath "html"
      within 'h1' do
        # expect(page).to have_xpath "html"  # => page is below whithin criteria
        expect(page).to have_no_xpath 'html'  # => how have to correct

        expect(page).to have_text 'Hello'
        # puts page.html
      end
      expect(page).to have_selector 'span', text: /(from .+index.html.*)/
      # binding.pry
    end
    scenario 'index page has bootstrap styling' do
      # puts page.html
      expect(page).to have_css 'h1'
    end
  end
  xfeature 'with Angular when the main page is accessed', js: true do
    before(:each) do
      # binding.pry
      visit '/'
    end
    scenario 'displays the main application page' do
      # puts page.html
      # expect(page).to have_selector 'h2', text: 'Sample App'
      expect(page).to have_content 'Sample App' && '(from spa-demo/pages/main.html)'
    end
    scenario 'displays the foos tile' do
      expect(page).to have_content 'Foos' && '(from spa-demo/foos/foos.html)'

      # foo = Foo.create! valid_attributes
      # expect(page).to have_content foo.name
    end
  end
end