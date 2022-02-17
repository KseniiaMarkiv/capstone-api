require 'rails_helper'

RSpec.describe "cities/show", type: :view do
  before(:each) { City.delete_all }
  after(:each) { City.delete_all }
  
  before(:each) do
    @city = assign(:city, FactoryBot.create(:city))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Name/)
  end
end
