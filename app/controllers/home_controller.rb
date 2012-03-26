class HomeController < ApplicationController
  def index
    @todo = TracksAPI.new("http://kulti.fi/tracks", "feeltask", "feeltask").todo(47)["todo"]
  end
end
