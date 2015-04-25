set :stage, :staging
server '52.74.162.19',
user: 'ubuntu',
roles: %w{app},
ssh_options: {
	user: 'ubuntu', # overrides user setting above
	keys: %w(/Users/bhuwan/Downloads/rd_staging.pem),
	forward_agent: false,
	auth_methods: %w(publickey password),
	# password: ''
}
