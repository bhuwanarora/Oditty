set :stage, :production
server '178.79.137.190',
user: 'bhuwan',
roles: %w{app},
ssh_options: {
	user: 'bhuwan', # overrides user setting above
	# keys: %w(/home/user_name/.ssh/id_rsa),
	forward_agent: false,
	auth_methods: %w(publickey password),
	password: ''
}
