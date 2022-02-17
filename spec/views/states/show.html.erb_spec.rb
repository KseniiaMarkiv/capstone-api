require 'rails_helper'

RSpec.describe "states/show", type: :view do
  before(:each) { State.delete_all }
  after(:each) { State.delete_all }

  before(:each) do
    @state = assign(:state, FactoryBot.create(:state))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Name/)
  end
end
