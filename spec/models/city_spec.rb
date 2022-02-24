require 'rails_helper'

RSpec.describe City, type: :model do
  let!(:before_count) { City.count }
  let(:city) { FactoryBot.create(:city) }
  
  context "City model" do
    it "created Foo will be persisted and be found" do
      expect(city).to be_persisted
      expect(City.find(city.id)).to_not be_nil
    end
    it "has a name" do
      city.validate 
      expect(city.errors[:city]).to_not include("can't be blank")    
    end
    it "is valid with valid attributes" do
      expect(city).to be_valid
    end
    it "is not valid without a name" do
      expect(city.name).to_not be_nil
    end
  end

end