require 'rails_helper'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to test the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator. If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails. There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.

RSpec.describe "/states", type: :request do
  
  # This should return the minimal set of attributes required to create a valid
  # State. As you add validations to State, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) {
    # skip("Add a hash of attributes valid for your model")
    { name: "test" }
  }

  let(:invalid_attributes) {
    # skip("Add a hash of attributes invalid for your model")
    { name: nil }
  }

  describe "GET /index" do
    it "renders a successful response" do
      State.create! valid_attributes
      get states_url
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      state = State.create! valid_attributes
      get state_url(state)
      expect(response).to be_successful
    end
  end

  describe "GET /new" do
    it "renders a successful response" do
      get new_state_url
      expect(response).to be_successful
    end
  end

  describe "GET /edit" do
    it "renders a successful response" do
      state = State.create! valid_attributes
      get edit_state_url(state)
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new State" do
        expect {
          post states_url, params: { state: valid_attributes }
        }.to change(State, :count).by(1)
      end

      it "redirects to the created state" do
        post states_url, params: { state: valid_attributes }
        expect(response).to redirect_to(state_url(State.last))
      end
    end

    context "with invalid parameters" do
      it "does not create a new State" do
        expect {
          post states_url, params: { state: invalid_attributes }
        }.to change(State, :count).by(0)
      end

      it "renders a successful response (i.e. to display the 'new' template)" do
        post states_url, params: { state: invalid_attributes }
        # expect(response).to be_successful
        # expect(response).to have_http_status(:unprocessable_entity)
        assert_response :unprocessable_entity
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) {
        # skip("Add a hash of attributes valid for your model")
        { name: "test_updated" }
      }

      it "updates the requested state" do
        state = State.create! valid_attributes
        patch state_url(state), params: { state: new_attributes }
        state.reload
        # skip("Add assertions for updated state")
        assert_equal "test_updated", state.name
      end

      it "redirects to the state" do
        state = State.create! valid_attributes
        patch state_url(state), params: { state: new_attributes }
        state.reload
        expect(response).to redirect_to(state_url(state))
      end
    end

    context "with invalid parameters" do
      it "renders a successful response (i.e. to display the 'edit' template)" do
        state = State.create! valid_attributes
        patch state_url(state), params: { state: invalid_attributes }
        # expect(response).to be_successful
        assert_response :unprocessable_entity
        # expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested state" do
      state = State.create! valid_attributes
      expect {
        delete state_url(state)
      }.to change(State, :count).by(-1)
    end

    it "redirects to the states list" do
      state = State.create! valid_attributes
      delete state_url(state)
      expect(response).to redirect_to(states_url)
    end
  end
end
