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

sudo apt-get install npm
sudo npm install -g grunt-cli
sudo npm install grunt --save-dev

mkdir rd
cd rd
git init
git remote add origin 
git pull origin master

bundle install