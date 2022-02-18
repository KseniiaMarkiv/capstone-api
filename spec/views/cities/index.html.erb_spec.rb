require 'rails_helper'

RSpec.describe "cities/index", type: :view do
  before(:each) do
    assign(:cities, [
      FactoryBot.create(:city), FactoryBot.create(:city)
    ])
  end

  it "renders a list of cities" do
    render
    assert_select "tr>th", text: "Name:".to_s, count: 2
  end
end
