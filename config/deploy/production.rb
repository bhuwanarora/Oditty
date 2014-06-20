set :stage, :production
 server '178.79.137.190',
   user: 'root',
   roles: %w{app},
   ssh_options: {
     user: 'root', # overrides user setting above
    # keys: %w(/home/user_name/.ssh/id_rsa),
     forward_agent: false,
     auth_methods: %w(publickey password),
     password: 'redrose@lrd'
   }
