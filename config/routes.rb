Rails.application.routes.draw do
  resources :foos
  resources :cities
  resources :states

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  get '/ui'  => 'ui#index'
  get '/ui#' => 'ui#index'
  root "ui#index"
end
