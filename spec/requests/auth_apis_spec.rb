# review and build MODERN TESTING

require 'rails_helper'

RSpec.describe 'Authentication Api', type: :request do
  include_context "db_cleanup_each", :transaction
  let(:user_props) { FactoryBot.attributes_for(:user) }

  let(:invalid_attributes) {
    # skip("Add a hash of attributes invalid for your model")
    { name: nil }
  }
  let(:valid_headers) {
     { headers: headers } 
  }
  let(:bad_id) {
    { id: 1234567890 }
  }

  xcontext 'sign-up' do
    context 'valid registration' do

      it 'successfully creates account' do
        signup user_props

        pp json=parsed_body
        expect(json).to include("status"=>"success")
        expect(json).to include("data")
        expect(json["data"]).to include("id")
        expect(json["data"]).to include("provider"=>"email")
        expect(json["data"]).to include("uid"=>user_props[:email])
        expect(json["data"]).to include("name"=>user_props[:name])
        expect(json["data"]).to include("email"=>user_props[:email])
        expect(json["data"]).to include("created_at","updated_at")
      end
    end

    context 'invalid registration' do
      context 'missing information' do
        it 'reports error with messages' do
          signup user_props.except(:email), :unprocessable_entity
        pp parsed_body

        json=parsed_body
        expect(json).to include("status"=>"error")
        expect(json).to include("data")
        expect(json["data"]).to include("email"=>nil)
        expect(json).to include("errors")
        expect(json["errors"]).to include("email")
        expect(json["errors"]).to include("full_messages")
        expect(json["errors"]["full_messages"]).to include(/Email/i)

        end
      end
    end
    context 'non-unique information' do
      it 'reports non-unique e-mail' do
        signup user_props, :ok
        signup user_props, :unprocessable_entity
        
        json=parsed_body
        expect(json).to include("status"=>"error")
        expect(json).to include("errors")
        expect(json["errors"]).to include("email")
        expect(json["errors"]).to include("full_messages")
        expect(json["errors"]["full_messages"]).to include(/Email/i)
      end
    end

  end # sign-up

  xcontext 'anonymous user' do
    it 'accesses unprotected' do
      get "/authn/whoami"
      pp parsed_body
      expect(response).to have_http_status(:success)
      expect(parsed_body).to eq({})
    end
    it 'fails to access protected resource' do
      get "/authn/checkme"
      pp parsed_body
      expect(response).to have_http_status(:unauthorized)
      expect(parsed_body).to include("errors"=>["You need to sign in or sign up before continuing."])
    end
  end # anonymous user

  xcontext 'login' do
    let(:account) { signup user_props, :ok }
    let!(:user) { login account, :ok }

    context 'valid user login' do

      xit 'generates access token' do
        expect(response.headers).to include("uid"=>account[:uid])
        expect(response.headers).to include("access-token")
        expect(response.headers).to include("client")
        expect(response.headers).to include("token-type"=>"Bearer")
      end
     
      xit 'extracts access headers' do
        expect(access_tokens?).to be true
        expect(access_tokens).to include("uid"=>account[:uid])
        expect(access_tokens).to include("access-token")
        expect(access_tokens).to include("client")
        expect(access_tokens).to include("token-type"=>"Bearer")
      end

      xit 'grants access to resource' do
        get authn_checkme_path, access_tokens
        #pp parsed_body
        expect(response).to have_http_status(:ok)

        pp json=parsed_body
        expect(json).to include("id"=>account[:id])
        expect(json).to include("uid"=>account[:uid])
      end
      xit "grants access to resource multiple times" do
        (1..10).each do |idx|
          puts idx
          sleep 6
          #quick calls < 5sec use same tokens
          get authn_checkme_path, access_tokens
          expect(response).to have_http_status(:ok)
        end
      end

      it 'logout' do
        logout :ok
        expect(access_tokens?).to be false

        get authn_checkme_path, access_tokens
        expect(response).to have_http_status(:unauthorized)
      end
      xcontext 'invalid password' do
        it 'rejects credentials' do
          login account.merge(:password=>"badpassword"), :unauthorized
        end
      end
    end

  end # login
  
end
