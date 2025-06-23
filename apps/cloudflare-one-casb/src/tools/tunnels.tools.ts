import { z } from 'zod'

import { withAccountCheck } from '@repo/mcp-common/src/api/account.api'
import { getCloudflareClient } from '@repo/mcp-common/src/cloudflare-api'
import type { ToolDefinition } from '@repo/mcp-common/src/types/tools.types'

import type { CASBMCP } from '../cf1-casb.app'

const toolDefinitions: Array<ToolDefinition<any>> = [
	{
		name: 'zero_trust_tunnels_list',
		description: 'List Zero Trust Tunnels',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.tunnels.list({ account_id: accountId })
		},
	},

	{
		name: 'zero_trust_tunnels_list_cloudflared',
		description: 'List Zero Trust Cloudflare Tunnels',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.tunnels.cloudflared.list({ account_id: accountId })
		},
	},
	{
		name: 'zero_trust_tunnels_get_cloudflared',
		description: 'List Zero Trust Get Cloudflare Tunnel by ID',
		params: {
			tunnelId: z.string(),
		},
		handler: async ({ accountId, apiToken, tunnelId }: { accountId: string; apiToken: string; tunnelId: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.tunnels.cloudflared.get(tunnelId, { account_id: accountId })
		},
	},
	{
		name: 'zero_trust_tunnels_get_cloudflared_config',
		description: 'List Zero Trust Get Cloudflare Tunnel Configurations',
		params: {
			tunnelId: z.string(),
		},
		handler: async ({ accountId, apiToken, tunnelId }: { accountId: string; apiToken: string; tunnelId: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.tunnels.cloudflared.configurations.get(tunnelId, { account_id: accountId })
		},
	},
	{
		name: 'zero_trust_tunnels_get_cloudflared_connections',
		description: 'List Zero Trust Get Cloudflare Tunnel Connections',
		params: {
			tunnelId: z.string(),
		},
		handler: async ({ accountId, apiToken, tunnelId }: { accountId: string; apiToken: string; tunnelId: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.tunnels.cloudflared.connections.get(tunnelId, { account_id: accountId })
		},
	},
	{
		name: 'zero_trust_cloudflared_tunnel_connector_get',
		description: 'List Zero Trust Get Cloudflare Tunnel Connector',
		params: {
			tunnelId: z.string(),
			connectorId: z.string(),
		},
		handler: async ({ accountId, apiToken, tunnelId, connectorId }: { accountId: string; apiToken: string; tunnelId: string; connectorId: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.tunnels.cloudflared.connectors.get(tunnelId, connectorId, { account_id: accountId })
		},
	},
	{
		name:'zero_trust_cloudflared_tunnel_token_get',
		description: 'List Zero Trust Get Cloudflare Tunnel Token',
		params: {
			tunnelId: z.string(),
		},
		handler: async ({ accountId, apiToken, tunnelId }: { accountId: string; apiToken: string; tunnelId: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.tunnels.cloudflared.token.get(tunnelId, { account_id: accountId })
		},
	},
	{
		name: 'zero_trust_tunnels_list_warp_connector_tunnels',
		description: 'List Zero Trust WARP Connector Tunnels',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.tunnels.warpConnector.list({ account_id: accountId })
		},
	},
	{
		name:'zero_trust_tunnels_get_warp_connector_tunnel',
		description: 'List Zero Trust Get WARP Connector Tunnel',
		params: {
			tunnelId: z.string(),
		},
		handler: async ({ accountId, apiToken, tunnelId }: { accountId: string; apiToken: string; tunnelId: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.tunnels.warpConnector.get(tunnelId, { account_id: accountId })
		},
	},
	{
		name:'zero_trust_tunnels_get_warp_connector_tunnel_token',
		description: 'List Zero Trust Get WARP Connector Tunnel Token',
		params: {
			tunnelId: z.string(),
		},
		handler: async ({ accountId, apiToken, tunnelId }: { accountId: string; apiToken: string; tunnelId: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.tunnels.warpConnector.token.get(tunnelId, { account_id: accountId })
		},
	},
]

/**
 * Registers the logs analysis tool with the MCP server
 * @param agent The MCP server instance
 */
export function registerZeroTrustTunnelsTools(agent: CASBMCP) {
	toolDefinitions.forEach(({ name, description, params, handler }) => {
		agent.server.tool(name, description, params, withAccountCheck(agent, handler))
	})
}
