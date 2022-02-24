require 'rails_helper'
# require 'mongo'
# Mongo::Logger.logger.level = ::Logger::DEBUG
# Mongo::Logger.logger.level = ::Logger::INFO

RSpec.describe State, type: :model do
#   # include Mongoid::Matchers
#   before(:all) do
#     State.delete_all
#   end

  context State do
    it { is_expected.to have_field(:name).of_type(String).with_default_value_of(nil) }
  end

  let(:state) { FactoryBot.create(:state) }
  after(:each) do
    State.delete_all
  end
  
  context "State model" do
    it "created State will be persisted and be found" do
      expect(state).to be_persisted
      expect(State.find(state.id)).to_not be_nil
    end
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

  context "created State (let)" do
    it { expect(state).to be_persisted }
    it { expect(state.name).to eq(state.name) }
    it { expect(State.find(state.id)).to_not be_nil }
  end

end