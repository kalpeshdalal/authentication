module.exports = {
	apps: [
		{
			name: "auth-api-test",
			script: "src/index.js",
			watch: false,
			autorestart: true,
			restart_delay: 1000,
			env: {
				NODE_ENV: "development",
			},
			env_production: {
				NODE_ENV: "production",
			},
		},
	],
};
