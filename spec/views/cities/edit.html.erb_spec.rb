require 'rails_helper'

RSpec.describe "cities/edit", type: :view do
  before(:each) { City.delete_all }
  after(:each) { City.delete_all }

  before(:each) do
    @city = assign(:city, FactoryBot.create(:city))
  end

  it "renders the edit city form" do
    render

    assert_select "form[action=?][method=?]", city_path(@city), "post" do

      assert_select "input[name=?]", "city[name]"
    end
  end
end
