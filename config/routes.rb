Rails.application.routes.draw do
  resources :foos
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "ui#index"
end
