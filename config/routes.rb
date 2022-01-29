Rails.application.routes.draw do
  namespace :api, defaults: {format: :json} do
    resources :cities
    # resources :states
  end
end
