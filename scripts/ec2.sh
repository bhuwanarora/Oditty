echo "pluto" > /etc/hostname
hostname -F /etc/hostname

sudo apt-get update
sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties
cd
git clone git://github.com/sstephenson/rbenv.git .rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

rbenv install 2.1.2
rbenv global 2.1.2	
ruby -v
echo "gem: --no-ri --no-rdoc" > ~/.gemrc
git config --global color.ui true
git config --global user.name "bhuwan"
git config --global user.email "saurabhp0000@gmail.com"
ssh-keygen -t rsa -C "saurabhp0000@gmail.com"
cat ~/.ssh/id_rsa.pub
ssh -T git@github.com
sudo add-apt-repository ppa:bhuwan/node.js
sudo apt-get update
sudo apt-get install nodejs
gem install rails
rbenv rehash
rails -v
sudo sh -c "echo 'deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main' > /etc/apt/sources.list.d/pgdg.list"
wget --quiet -O - http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install build-essential python-all-dev git vim python-dev python-pip python-software-properties g++ gcc make libssl-dev libreadline6-dev libaio-dev libbz2-dev zlib1g-dev libjpeg62-dev libpcre3-dev libexpat1-dev libxml2 libxml2-dev libjson0 libjson0-dev liblzma-dev libevent-dev wget zip unzip

apt-cache search postgresql-9.3

wget http://anonscm.debian.org/loggerhead/pkg-postgresql/postgresql-common/trunk/download/head:/apt.postgresql.org.s-20130224224205-px3qyst90b3xp8zj-1/apt.postgresql.org.sh
chmod 777 apt.postgresql.org.sh
sudo ./apt.postgresql.org.sh
sudo apt-get install binutils libproj-dev libgeoip1 libgtk2.0 xsltproc docbook-xsl docbook-mathml

wget http://download.osgeo.org/geos/geos-3.4.2.tar.bz2
tar xfj geos-3.4.2.tar.bz2
cd geos-3.4.2
./configure
make
sudo make install
cd ..
wget http://download.osgeo.org/gdal/1.10.1/gdal-1.10.1.tar.gz
tar xfz gdal-1.10.1.tar.gz
cd gdal-1.10.1
./configure --with-python
make
sudo make install
cd ..
sudo apt-get install binutils libproj-dev gdal-bin libgeoip1 libgtk2.0
sudo apt-get install postgresql-9.3-postgis-2.1
whoami

# sudo apt-get install postgresql-common
# sudo apt-get install postgresql-9.3 libpq-dev
# sudo -u postgres createuser bhuwan -s
# sudo -u postgres psql

# wget http://launchpadlibrarian.net/172798221/postgresql-9.3-postgis-2.1_2.1.2%2Bdfsg-2_i386.deb
# sudo dpkg -i postgresql-9.3-postgis-2.1_2.1.2+dfsg-2_i386.deb

sudo -i
wget -O - http://debian.neo4j.org/neotechnology.gpg.key | apt-key add -
echo 'deb http://debian.neo4j.org/repo stable/' > /etc/apt/sources.list.d/neo4j.list
apt-get update
apt-get install neo4j
service neo4j-service status


mkdir rd
cd rd
git init
git remote add origin git@github.com:test-rd/rd.git
git pull origin master

sudo apt-get install postgresql
sudo apt-get install libpq-dev
sudo apt-get install graphicsmagick-libmagick-dev-compat
sudo apt-get install libmagickcore-dev 
sudo apt-get install libmagickwand-dev
bundle install


touch config/database.yml
vim config/database.yml #add username and other details
sudo -u postgres createuser bhuwan
sudo -u postgres psql -c " ALTER ROLE bhuwan CREATEDB" 
# psql -U ubuntu postgres
sudo -u postgres psql -c "DROP EXTENSION PostGIS;"
sudo -u postgres psql -c "CREATE SCHEMA postgis;"
sudo -u postgres psql -c "CREATE EXTENSION PostGIS WITH SCHEMA postgis;"
sudo -u postgres psql -c "GRANT ALL ON postgis.geometry_columns TO PUBLIC;"
sudo -u postgres psql -c "GRANT ALL ON postgis.spatial_ref_sys TO PUBLIC"
sudo -u postgres psql -c "ALTER USER bhuwan WITH SUPERUSER;"
rake db:create
# psql -d readers_door_development -f /usr/share/postgresql/9.3/contrib/postgis-2.1/postgis.sql
# 

rake db:migrate

rake neo4j:install[advanced,2.1]



sudo apt-get install npm
sudo npm install -g grunt-cli
sudo npm install grunt --save-dev


add-apt-repository ppa:nginx/stable
apt-get update
apt-get upgrade --show-upgraded
apt-get install nginx
/etc/init.d/nginx start

cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.$(date "+%b_%d_%Y_%H.%M.%S")


gpg --keyserver keyserver.ubuntu.com --recv-keys 561F9B9CAC40B2F7
gpg --armor --export 561F9B9CAC40B2F7 | sudo apt-key add -
sudo apt-get install apt-transport-https
sudo sh -c "echo 'deb https://oss-binaries.phusionpassenger.com/apt/passenger trusty main' >> /etc/apt/sources.list.d/passenger.list"
sudo chown root: /etc/apt/sources.list.d/passenger.list
sudo chmod 600 /etc/apt/sources.list.d/passenger.list
sudo apt-get update
sudo apt-get install nginx-full passenger
sudo service nginx start

apt-get install redis-server
# gem install thin
# sudo apt-get install thin
# sudo /usr/sbin/update-rc.d -f thin defaults
# thin config -C /etc/thin2.0/readersdoor.com -c /var/www/readersdoor.com --servers 3 -e production # or: -e production for caching, etc

# touch /etc/nginx/sites-available/readersdoor.com

# upstream myapp {
#   server 127.0.0.1:3000;
#   server 127.0.0.1:3001;
#   server 127.0.0.1:3002;
# }
# server {
#   listen   80;
#   server_name .readersdoor.com;

#   access_log /var/www/readersdoor.com/log/access.log;
#   error_log  /var/www/readersdoor.com/log/error.log;
#   root     /var/www/readersdoor.com;
#   index    index.html;

#   location / {
#     proxy_set_header  X-Real-IP  $remote_addr;
#     proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
#     proxy_set_header  Host $http_host;
#     proxy_redirect  off;
#     try_files /system/maintenance.html $uri $uri/index.html $uri.html @ruby;
#   }

#   location @ruby {
#     proxy_pass http://readersdoor;
#   }
# }

# ln -nfs /etc/nginx/sites-available/readersdoor.com /etc/nginx/sites-enabled/readersdoor.com
# /etc/init.d/thin restart && /etc/init.d/nginx reload; tail -f log/*.log