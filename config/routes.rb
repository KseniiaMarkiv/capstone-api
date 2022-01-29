Rails.application.routes.draw do
  namespace :api, defaults: {format: :json} do
    resources :cities, except: [:new, :edit]
    resources :states, except: [:new, :edit]
  end
end
