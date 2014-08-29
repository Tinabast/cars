class ImagesController < ApplicationController
  def image
    old_image = params[:image]
    new_image = "5-stars.jpg"
    if old_image == "blob_4.gif"
      new_image = "5-stars.jpg"
    end
    image_url = Rails.root.join('app', 'assets', 'images', new_image) # returns an absolute local file path or a URL

    response.headers['Cache-Control'] = "public, max-age=#{12.hours.to_i}"
    response.headers['Content-Type'] = 'image/jpeg'
    response.headers['Content-Disposition'] = 'inline'
    render :text => open(image_url, "rb").read
  end
end