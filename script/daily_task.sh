cd /home/centos/rd;
PATH=/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/usr/local/rvm/bin:/home/centos/.local/bin:/home/centos/bin:/home/centos/.local/bin:/home/centos/bin
RAILS_ENV=production rake daily_tasks:user_wait_list;
RAILS_ENV=production rake get_media:news;
