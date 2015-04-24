set :stage, :staging
server '52.74.166.1',
user: 'ubuntu',
roles: %w{app},
ssh_options: {
	user: 'centos', # overrides user setting above
	keys: %w(/home/palashgupta577/Downloads/rd_staging.pem),
	forward_agent: false,
	auth_methods: %w(publickey password),
	# password: ''
}
