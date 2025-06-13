import { z } from 'zod'

import { withAccountCheck } from '@repo/mcp-common/src/api/account.api'
import { getCloudflareClient } from '@repo/mcp-common/src/cloudflare-api'
import { ToolDefinition } from '@repo/mcp-common/src/types/tools.types'

import type { ZeroTrustDLPMCP } from '../dlp.app'

const toolDefinitions: Array<ToolDefinition<any>> = [
	// datasets
	{
		name: 'dlp_datasets_get',
		description: 'Get DLP datasets',
		params: { datasetId: z.string() },
		handler: async ({
			accountId,
			apiToken,
			datasetId,
		}: {
			accountId: string
			apiToken: string
			datasetId: string
		}) =>
			await getCloudflareClient(apiToken).zeroTrust.dlp.datasets.get(datasetId, {
				account_id: accountId,
			}),
	},
	{
		name: 'dlp_datasets_list',
		description: 'List DLP datasets',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) =>
			await getCloudflareClient(apiToken).zeroTrust.dlp.datasets.list({
				account_id: accountId,
			}),
	},
	// email
	{
		name: 'dlp_email_get_account_mapping',
		description: 'Get DLP email account mapping',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) =>
			await getCloudflareClient(apiToken).zeroTrust.dlp.email.accountMapping.get({
				account_id: accountId,
			}),
	},
	{
		name: 'dlp_get_email_scanner_rule',
		description: 'Get a specific DLP email scanner rule',
		params: { ruleId: z.string() },
		handler: async ({
			accountId,
			apiToken,
			ruleId,
		}: {
			accountId: string
			apiToken: string
			ruleId: string
		}) =>
			await getCloudflareClient(apiToken).zeroTrust.dlp.email.rules.get(ruleId, {
				account_id: accountId,
			}),
	},
	{
		name: 'dlp_list_all_email_scanner_rule',
		description: 'List all DLP email scanner rules',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) =>
			await getCloudflareClient(apiToken).zeroTrust.dlp.email.rules.list({
				account_id: accountId,
			}),
	},

	// entries
	{
		name: 'dlp_list_entries',
		description: 'List DLP entries',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) =>
			await getCloudflareClient(apiToken).zeroTrust.dlp.entries.list({
				account_id: accountId,
			}),
	},
	{
		name: 'dlp_get_entry',
		description: 'Get a specific DLP entry',
		params: { entryId: z.string() },
		handler: async ({
			accountId,
			apiToken,
			entryId,
		}: {
			accountId: string
			apiToken: string
			entryId: string
		}) =>
			await getCloudflareClient(apiToken).zeroTrust.dlp.entries.get(entryId, {
				account_id: accountId,
			}),
	},
	// limits
	{
		name: 'dlp_fetch_limits',
		description: 'Fetch DLP limits',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) =>
			await getCloudflareClient(apiToken).zeroTrust.dlp.limits.list({
				account_id: accountId,
			}),
	},
	// patterns
	{
		name: 'dlp_patterns_validate',
		description: 'Validate DLP patterns',
		params: {
			regex: z.string(),
			max_match_bytes: z.number().optional(),
		},
		handler: async ({
			accountId,
			apiToken,
			regex,
			max_match_bytes,
		}: {
			accountId: string
			apiToken: string
			regex: string
			max_match_bytes?: number
		}) =>
			await getCloudflareClient(apiToken).zeroTrust.dlp.patterns.validate({
				account_id: accountId,
				regex,
				max_match_bytes,
			}),
	},
	// payload logs
	{
		name: 'dlp_payload_logs_get',
		description: 'Get DLP payload logs',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.dlp.payloadLogs.get({ account_id: accountId })
		},
	},
	// profiles
	{
		name: 'dlp_list_profiles',
		description: 'List all DLP profiles',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.dlp.profiles.list({ account_id: accountId })
		},
	},
	{
		name: 'dlp_get_profile',
		description: 'Get a specific DLP profile',
		params: { profileId: z.string() },
		handler: async ({
			accountId,
			apiToken,
			profileId,
		}: {
			accountId: string
			apiToken: string
			profileId: string
		}) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.dlp.profiles.get(profileId, { account_id: accountId })
		},
	},
	{
		name: 'dlp_get_custom_profile',
		description: 'Get a custom DLP profile',
		params: { profileId: z.string() },
		handler: async ({
			accountId,
			apiToken,
			profileId,
		}: {
			accountId: string
			apiToken: string
			profileId: string
		}) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.dlp.profiles.custom.get(profileId, { account_id: accountId })
		},
	},
	{
		name: 'dlp_get_predefined_profile',
		description: 'Get a predefined DLP profile',
		params: { profileId: z.string() },
		handler: async ({
			accountId,
			apiToken,
			profileId,
		}: {
			accountId: string
			apiToken: string
			profileId: string
		}) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.dlp.profiles.predefined.get(profileId, {
				account_id: accountId,
			})
		},
	},
]

/**
 * Registers the logs analysis tool with the MCP server
 * @param agent The MCP server instance
 */
export function registerZeroTrustDLPTools(agent: ZeroTrustDLPMCP) {
	toolDefinitions.forEach(({ name, description, params, handler }) => {
		agent.server.tool(name, description, params, withAccountCheck(agent, handler))
	})
}
