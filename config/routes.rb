Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

match 'todo/show' => 'todo#show',via:[:get, :post]
#get "todo/show"
match 'todo/create' => 'todo#create',via:[:post]
match 'todo/edit' => 'todo#edit',via:[:post]
match 'todo/delete' => 'todo#delete',via:[:delete]
match 'todo/home' => 'home#home',via:[:get]
end
