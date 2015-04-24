set :stage, :staging
server '52.74.162.19',
user: 'centos',
roles: %w{app},
ssh_options: {
	user: 'centos', # overrides user setting above
	keys: %w(/home/palashgupta577/Downloads/rd_production.pem),
	forward_agent: false,
	auth_methods: %w(publickey password),
	# password: ''
}
