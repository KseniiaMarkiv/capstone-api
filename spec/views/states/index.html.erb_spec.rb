require 'rails_helper'

RSpec.describe "states/index", type: :view do
  before(:each) { State.delete_all }
  after(:each) { State.delete_all }

  before(:each) do
    assign(:states, [
      FactoryBot.create(:state),
      FactoryBot.create(:state)
    ])
  end

  it "renders a list of states" do
    render
    assert_select "tr>th", text: "Name:".to_s, count: 2
  end
end
