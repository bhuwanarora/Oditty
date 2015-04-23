# config valid only for Capistrano 3.1
lock '3.2.1'


# rbenv
set :rbenv_type, :root
set :rbenv_ruby, '2.0.0-p598'

# bundler
set :bundle_gemfile, -> { release_path.join('Gemfile') }
set :bundle_dir, -> { shared_path.join('bundle') }
#set :bundle_dir, -> { path: "/usr/bin/bundle" }
set :bundle_flags, '--deployment --quiet'
set :bundle_without, %w{development test}.join(' ')
set :bundle_binstubs, -> { shared_path.join('bin') }
set :bundle_roles, :all
set :application, 'rd'
set :repo_url, 'git@github.com:test-rd/rd.git'
# set :whenever_environment, defer { stage }
# set :whenever_command, 'bundle exec whenever'
# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }

# Default deploy_to directory is /var/www/my_app
set :deploy_to, '/home/ubuntu/deploy'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
set :linked_files, %w{config/database.yml}

# Default value for linked_dirs is []
set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default value for default_env is {}
set :default_env, { path: "~/.rbenv/shims:~/.rbenv/bin:$PATH" }
#set :default_env, { path: "/opt/ruby/bin:$PATH" }
# set :whenever_environment, defer { stage }
# Default value for keep_releases is 5
# set :keep_releases, 5

set :whenever_identifier, ->{ "readers_door_production" }

namespace :deploy do

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      execute :touch, release_path.join('tmp/restart.txt')
    end

  end
  

  namespace :deploy do
  # desc " bundle install gems "
  # task :bundle_install do 
  # on roles :all do
  #       puts " bundle install "
  #       # execute "cd #{release_path} && #{try_sudo} GEM_HOME=/opt/local/ruby/gems RAILS_ENV=#{} bundle exec whenever --clear-crontab #{application} --user #{ubuntu}"
  #       # execute "cd #{release_path} && #{try_sudo} GEM_HOME=/opt/local/ruby/gems RAILS_ENV=production bundle exec whenever --update-crontab #{application} --user #{ubuntu}"
  #       execute " cd #{release_path} && bundle install "
  #     end  
  #   end
    desc "Update the crontab file"  
    task :update_crontab do
      on roles :all do
        puts " updating crontab file"
        # execute "cd #{release_path} && #{try_sudo} GEM_HOME=/opt/local/ruby/gems RAILS_ENV=#{} bundle exec whenever --clear-crontab #{application} --user #{ubuntu}"
        # execute "cd #{release_path} && #{try_sudo} GEM_HOME=/opt/local/ruby/gems RAILS_ENV=production bundle exec whenever --update-crontab #{application} --user #{ubuntu}"
        execute "cd #{release_path} && bundle exec whenever --update-crontab "
      end  
    end
  end
  after "deploy:symlink:linked_dirs",  "deploy:update_crontab"  



  after :publishing, :restart
  after :finishing, 'deploy:cleanup'
end