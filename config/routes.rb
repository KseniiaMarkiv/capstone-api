Rails.application.routes.draw do
  resources :states
  namespace :api, defaults: {format: :json} do
    resources :cities, except: [:new, :edit]
    # resources :states
  end
end
