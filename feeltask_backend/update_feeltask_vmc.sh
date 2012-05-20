#bin/sh
echo Updating Feeltask now!
echo Precompiling assets
rm -rf public/assets
RAILS_ENV=production rake assets:precompile
echo Updating feeltask on cloudfoundry...
vmc update feeltask
echo Removing precompilations as they mess up development env...
rm -rf public/assets
echo All done!