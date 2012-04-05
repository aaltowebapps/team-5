class HomeController < ApplicationController
  def index
    @todo = TracksApi.new("http://kulti.fi/tracks", "feeltask", "feeltask").todo(47)["todo"]
  end
end
