#bin/sh
echo Updating Feeltask
echo Precompiling assets
rm -rf public/assets
RAILS_ENV=production rake assets:precompile
echo Updating feeltask on cloudfounry...
vmc update feeltask
echo All done!