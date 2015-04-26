set :stage, :production
server '52.74.154.196',
user: 'ubuntu',
roles: %w{app},
ssh_options: {
	user: 'ubuntu', # overrides user setting above
	keys: %w(/home/palashgupta577/Downloads/production_v1.pem),
	forward_agent: false,
	auth_methods: %w(publickey password),
	# password: ''
}
