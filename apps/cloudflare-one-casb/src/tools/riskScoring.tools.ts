import { z } from 'zod'

import { withAccountCheck } from '@repo/mcp-common/src/api/account.api'
import { getCloudflareClient } from '@repo/mcp-common/src/cloudflare-api'
import type { ToolDefinition } from '@repo/mcp-common/src/types/tools.types'

import type { CASBMCP } from '../cf1-casb.app'

const toolDefinitions: Array<ToolDefinition<any>> = [
	{
		name: 'zero_trust_risk_scoring_get_score_for_user',
		description: 'Get Risk Score for User',
		params: {
			userId: z.string(),
		},
		handler: async ({ accountId, apiToken, userId }: { accountId: string; apiToken: string; userId: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.riskScoring.get(userId, { account_id: accountId })
		},
	},
	{
		name:'zero_trust_risk_scoring_get_behaviors',
		description: 'Get all Behaviors and associated configuration',
		params: {

		},
		handler: async ({ accountId, apiToken  }: { accountId: string; apiToken: string  }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.riskScoring.behaviours.get({ account_id: accountId })
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
