SimpleCov.start 'rails' do
  add_filter '/spec'
  add_filter '/config'
  add_group 'foos', ['foo']
  add_group 'bars', ['bar']
end