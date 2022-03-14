require 'rails_helper'

RSpec.describe "Foo API", type: :request do
  include_context "db_cleanup_each", :transaction

  let(:valid_headers) {
     { headers: headers } 
  }
  let(:bad_id) {
      { id: 1234567890 }
  }
  let(:valid_attributes) {
    # skip("Add a hash of attributes valid for your model")
    FactoryBot.attributes_for(:foo)
  }

  context "caller requests list of Foos" do
    let!(:foos) { FactoryBot.create_list(:foo, 5) }

    it "returns all instances" do
      get api_foos_path, params: { :sample1=>"param", :sample2=>"param" },
                        headers: {"Accept"=>"application/json"}
      expect(request.method).to eq("GET")
      expect(response).to have_http_status(:ok)
      expect(response.content_type).to match(a_string_including("application/json"))
      expect(response["X-Frame-Options"]).to eq("SAMEORIGIN")

      json = parsed_body
      expect(json.count).to eq(foos.count)
      expect(json.map{|f|f["name"]}).to eq(foos.map{|f|f[:name]})
    end
  end

  context "a specific Foo exists" do
    # let(:foo) { FactoryBot.create(:foo) }

    it "returns Foo when using correct ID" do
      foo = Foo.create! valid_attributes
      get api_foos_path(foo.id), as: :json
      expect(response).to be_successful
      # pp parsed_body

      json=parsed_body

      expect(json).to include(have_key("id")) # we have Array
      expect(json).to include(have_key("name")) # we have to OPEN array
      expect(json[0]["id"]).to eq(foo.id)
      expect(json[0]["name"]).to eq(foo.name)

      # ------------------ SECOND WAY FIX ------we JUST OPEN the array ------------
      # expect(json[0]).to have_key("id")            WAS => expect(payload).to have_key("id")
      # expect(json[0]).to have_key("name")
      # expect(json[0]["id"]).to eq(foo.id)          WAS => expect(payload["id"]).to eq(foo.id)
      # expect(json[0]["name"]).to eq(foo.name)
    end
  end

    it "returns not found when using incorrect ID" do
      get api_foo_url(bad_id)
      pp parsed_body
      expect(response).to have_http_status(:not_found)
      expect(response.content_type).to match(a_string_including("application/json"))

      # json=parsed_body
      expect(json).to have_key("errors")
      expect(json["errors"]).to have_key("full_messages")
      expect(json["errors"]["full_messages"][0]).to include("cannot","#{bad_id.values}")
    end
end
