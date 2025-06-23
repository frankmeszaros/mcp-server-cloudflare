import { z } from 'zod'

import { withAccountCheck } from '@repo/mcp-common/src/api/account.api'
import { getCloudflareClient } from '@repo/mcp-common/src/cloudflare-api'
import type { ToolDefinition } from '@repo/mcp-common/src/types/tools.types'

import type { CASBMCP } from '../cf1-casb.app'

const toolDefinitions: Array<ToolDefinition<any>> = [
	{
		name: 'zero_trust_identity_providers_list',
		description: 'List Identity Providers',
		params: {},
		handler: async ({ accountId, apiToken  }: { accountId: string; apiToken: string;  }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.identityProviders.list({ account_id: accountId })
		},
	},
	{
		name:'zero_trust_identity_providers_get',
		description: 'Get Identity Provider by ID',
		params: {
			identityProviderId: z.string(),
		},
		handler: async ({ accountId, apiToken, identityProviderId }: { accountId: string; apiToken: string; identityProviderId: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.identityProviders.get(identityProviderId, { account_id: accountId })
		},
	},
	{
		name:'zero_trust_identity_providers_scim_group_resources_list',
		description: 'List SCIM Group Resources',
		params: {
			identityProviderId: z.string(),
		},
		handler: async ({ accountId, apiToken, identityProviderId }: { accountId: string; apiToken: string; identityProviderId: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.identityProviders.scim.groups.list(identityProviderId, { account_id: accountId })
		},
	},
	{
		name:'zero_trust_identity_providers_scim_user_resources_list',
		description: 'List SCIM User Resources',
		params: {
			identityProviderId: z.string(),
		},
		handler: async ({ accountId, apiToken, identityProviderId }: { accountId: string; apiToken: string; identityProviderId: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.identityProviders.scim.users.list(identityProviderId, { account_id: accountId })
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
