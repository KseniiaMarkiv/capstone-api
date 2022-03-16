require 'rails_helper'

module ApiHelper
  def parsed_body
    JSON.parse(response.body)
  end

   # automates the passing of payload bodies as json
  ["post", "put", "patch", "get", "head", "delete"].each do |http_method_name|
    define_method("j#{http_method_name}") do |path,params={},headers={}| 
      if ["post","put","patch"].include? http_method_name
        headers=headers.merge('content-type' => 'application/json') if !params.empty?
        params = params.to_json
      end
    end
  end


end