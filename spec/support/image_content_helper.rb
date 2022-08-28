module ImageContentHelper
  BASE_URL="https://loremflickr.com/cache/resized"
  URL_PATH="65535_51046544336_f19600366c_c_640_480_nofilter.jpg"
  IMAGE_PATH="db/images/vacaciones-playa-verano.jpg"


  def download_image
    image_url="#{BASE_URL}/#{URL_PATH}"
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