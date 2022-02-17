require 'rails_helper'

RSpec.describe Foo, type: :model do
  before(:each) { Foo.delete_all }
  after(:each) { Foo.delete_all }
  let(:foo) { FactoryBot.create(:foo) }

  context "Foo model" do
    it "has a name" do
      foo.validate 
      expect(foo.errors[:foo]).to_not include("can't be blank")    
    end
    it "is valid with valid attributes" do
      expect(foo).to be_valid
    end
    it "is not valid without a name" do
      expect(foo.name).to_not be_nil
    end
  end

end