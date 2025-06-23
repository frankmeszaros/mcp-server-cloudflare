import { z } from 'zod'

import { withAccountCheck } from '@repo/mcp-common/src/api/account.api'
import { getCloudflareClient } from '@repo/mcp-common/src/cloudflare-api'
import type { ToolDefinition } from '@repo/mcp-common/src/types/tools.types'

import type { CASBMCP } from '../cf1-casb.app'

const toolDefinitions: Array<ToolDefinition<any>> = [
	{
		name: 'zero_trust_networks_get_tunnel_route_by_ip',
		description: 'Get Tunnel Route by IP',
		params: {
			ip: z.string(),
		},
		handler: async ({ accountId, apiToken, ip }: { accountId: string; apiToken: string; ip: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.networks.routes.ips.get(ip, { account_id: accountId })
		},
	},

	{
		name:'zero_trust_networks_list_tunnel_routes',
		description: 'List Tunnel Routes',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.networks.routes.list({ account_id: accountId })
		},
	},
	{
		name:'zero_trust_networks_get_tunnel_route',
		description: 'Get Tunnel Route by ID',
		params: {
			routeId: z.string(),
		},
		handler: async ({ accountId, apiToken, routeId }: { accountId: string; apiToken: string; routeId: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.networks.routes.get(routeId, { account_id: accountId })
		}
	},
	{ name:'zero_trust_networks_subnets_list',
		description: 'List Subnets',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.networks.subnets.list({ account_id: accountId })
		},
	},
	{
		name:'zero_trust_networks_virtual_networks_list',
		description: 'List Virtual Networks',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.networks.virtualNetworks.list({ account_id: accountId })
		},
	},
	{
		name:'zero_trust_networks_virtual_networks_get',
		description: 'Get Virtual Network by ID',
		params: {
			virtualNetworkId: z.string(),
		},
		handler: async ({ accountId, apiToken, virtualNetworkId }: { accountId: string; apiToken: string; virtualNetworkId: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.networks.virtualNetworks.get(virtualNetworkId, { account_id: accountId })
		},
	},


]

/**
 * Registers the logs analysis tool with the MCP server
 * @param agent The MCP server instance
 */
export function registerZeroTrustRiskScoringTools(agent: CASBMCP) {
	toolDefinitions.forEach(({ name, description, params, handler }) => {
		agent.server.tool(name, description, params, withAccountCheck(agent, handler))
	})
}
