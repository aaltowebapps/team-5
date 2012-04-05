#bin/sh
echo Updating Feeltask now!
echo Precompiling assets
rm -rf public/assets
RAILS_ENV=production rake assets:precompile
echo Updating feeltask on cloudfounry...
vmc update feeltask
echo Removing precompilations as they mess up deveplopent env...
rm -rf public/assets
echo All done!