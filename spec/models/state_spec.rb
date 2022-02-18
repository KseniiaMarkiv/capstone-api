require 'rails_helper'

RSpec.describe State, type: :model do
  let(:state) { FactoryBot.create(:state) }
  
  context "State model" do
    it "has a name" do
      state.validate 
      expect(state.errors[:state]).to_not include("can't be blank")    
    end
    it "is valid with valid attributes" do
      expect(state).to be_valid
    end
    it "is not valid without a name" do
      expect(state.name).to_not be_nil
    end
  end

end