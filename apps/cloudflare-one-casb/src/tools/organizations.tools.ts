import { z } from 'zod'

import { withAccountCheck } from '@repo/mcp-common/src/api/account.api'
import { getCloudflareClient } from '@repo/mcp-common/src/cloudflare-api'
import type { ToolDefinition } from '@repo/mcp-common/src/types/tools.types'

import type { CASBMCP } from '../cf1-casb.app'

const toolDefinitions: Array<ToolDefinition<any>> = [
	{
		name: 'zero_trust_access_organization_list',
		description: 'List Organizations',
		params: {},
		handler: async ({ accountId, apiToken  }: { accountId: string; apiToken: string;  }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.organizations.list({ account_id: accountId })
		},
	},
	{
		name:'zero_trust_organization_doh_get',
		description: 'Get DoH Settings for an Organization',
		params: {},
		handler: async ({ accountId, apiToken  }: { accountId: string; apiToken: string  }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.organizations.doh.get({ account_id: accountId })
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
