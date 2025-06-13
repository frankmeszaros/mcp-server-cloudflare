// mcp-server-project/ecosystem.config.js

module.exports = {
	apps: [
		{
			name: 'cloudflare-one-access',
			script: 'pnpm',
			args: 'dev',
			cwd: './apps/cloudflare-one-access',
			watch: true, // Optional: restarts on file changes
		},
		{
			name: 'cloudflare-one-casb',
			script: 'pnpm',
			args: 'dev',
			cwd: './apps/cloudflare-one-casb',
			watch: true, // Optional: restarts on file changes
		},
		{
			name: 'cloudflare-one-dlp',
			script: 'pnpm',
			args: 'dev',
			cwd: './apps/cloudflare-one-dlp',
			watch: true,
		},
		{
			name: 'cloudflare-one-email-security',
			script: 'pnpm',
			args: 'dev',
			cwd: './apps/cloudflare-one-email-security',
			watch: true,
		},
		{
			name: 'cloudflare-one-gateway',
			script: 'pnpm',
			args: 'dev',
			cwd: './apps/cloudflare-one-gateway',
			watch: true,
		},
	],
}
