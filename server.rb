require 'sinatra'
require 'json'

get '/ex1' do
  File.read("ex1.html")
end

get '/ex2' do
  File.read("ex2.html")
end

get '/ex3' do
  File.read("ex3.html")
end

get '/ex4' do
  File.read("ex4.html")
end

get '/ex5' do
  File.read("ex5.html")
end

get '/ex6' do
  File.read("ex6.html")
end

get '/ex7' do
  File.read("ex7.html")
end

get '/ex8' do
  File.read("ex8.html")
end
