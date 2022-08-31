module ImageContentHelper
  random_city = ['travels', 'paris', 'florida', 'travel', 'ukraine', 'china', 'haiti', 'portugal', 'italy', 'india', 'israel', 'greece', 'barbados', 'brazil', 'belgium', 'estonia']
  BASE_URL=Faker::LoremFlickr.image(size: "840x680", search_terms: [random_city.sample])
  # URL_PATH="#{BASE_URL}"
  IMAGE_PATH="db/images/3.jpg"


  def download_image
    image_url="#{BASE_URL}"
    puts "downloading #{image_url} to #{IMAGE_PATH}"

    FileUtils::mkdir_p(File.dirname(IMAGE_PATH))
    source=open(image_url, ssl_verify_mode: OpenSSL::SSL::VERIFY_NONE)
    IO.copy_stream(source, IMAGE_PATH)
  end

  def image_file
    unless File.file?(IMAGE_PATH)
      download_image
    end
    return File.new(IMAGE_PATH,"rb")
  end

end
 