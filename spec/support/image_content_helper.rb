module ImageContentHelper
  random_city = ['travels', 'paris', 'florida', 'travel', 'ukraine', 'china', 'haiti', 'portugal', 'italy', 'india', 'israel', 'greece', 'barbados', 'brazil', 'belgium', 'estonia']
  BASE_URL=Faker::LoremFlickr.image(size: "840x680", search_terms: [random_city.sample])
  # URL_PATH="#{BASE_URL}"
  IMAGE_PATH="db/images/3.jpg"


  def self.download_image
    image_url="#{BASE_URL}"
    puts "downloading #{image_url} to #{IMAGE_PATH}"

    FileUtils::mkdir_p(File.dirname(IMAGE_PATH))
    source=open(image_url, ssl_verify_mode: OpenSSL::SSL::VERIFY_NONE)
    IO.copy_stream(source, IMAGE_PATH)
  end

  def self.sample_image_file
    unless File.file?(IMAGE_PATH)
      download_image
    end
    return File.new(IMAGE_PATH,"rb")
  end
  
  def self.sample_filepath
    unless File.file?(IMAGE_PATH)
      download_image
    end
    "#{Rails.root}/#{IMAGE_PATH}"
  end

  def image_filepath
    ImageContentHelper.sample_filepath
  end

  def image_file
    ImageContentHelper.sample_image_file
  end

  def create_large_file min_size
    srcfile=image_file
    bigfile=File.open("tmp/bigfile.jpg","wb")
    begin
      bigfile.write(srcfile.read)
      srcfile.rewind
    end while bigfile.size < min_size
    bigfile.close
    "#{Rails.root}/#{bigfile.path}"
  end
end
 