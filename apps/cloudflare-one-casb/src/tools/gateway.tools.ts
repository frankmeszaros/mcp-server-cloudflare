import { z } from 'zod'

import { withAccountCheck } from '@repo/mcp-common/src/api/account.api'
import { getCloudflareClient } from '@repo/mcp-common/src/cloudflare-api'
import type { ToolDefinition } from '@repo/mcp-common/src/types/tools.types'

import type { CASBMCP } from '../cf1-casb.app'

const toolDefinitions: Array<ToolDefinition<any>> = [
	// logging
	{
		name: 'zero_trust_gateway_logging_settings',
		description: 'Get Zero Trust Gateway Logging Settings',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.gateway.logging.get({ account_id: accountId })
		},
	},

	// rules
	{
		name: 'zero_trust_gateway_rules_list',
		description: 'List Zero Trust Gateway Rules',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) => {
			const client = getCloudflareClient(apiToken)
			const resp = await client.zeroTrust.gateway.rules.list({ account_id: accountId })
			return { rules: resp.result || [] }
		},
	},
	{
		name: 'zero_trust_gateway_rule_details',
		description: 'Get Zero Trust Gateway Rule Details',
		params: { gatewayRuleId: z.string() },
		handler: async ({
			accountId,
			apiToken,
			gatewayRuleId,
		}: {
			accountId: string
			apiToken: string
			gatewayRuleId: string
		}) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.gateway.rules.get(gatewayRuleId, {
				account_id: accountId,
			})
		},
	},

	// proxy endpoints
	{
		name: 'zero_trust_gateway_proxy_endpoints_list',
		description: 'List Zero Trust Gateway Proxy Endpoints',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.gateway.proxyEndpoints.list({ account_id: accountId })
		},
	},
	{
		name: 'zero_trust_gateway_proxy_endpoints_get',
		description: 'Get Zero Trust Gateway Proxy Endpoint',
		params: { proxyEndpointId: z.string() },
		handler: async ({
			accountId,
			apiToken,
			proxyEndpointId,
		}: {
			accountId: string
			apiToken: string
			proxyEndpointId: string
		}) =>
			await getCloudflareClient(apiToken).zeroTrust.gateway.proxyEndpoints.get(proxyEndpointId, {
				account_id: accountId,
			}),
	},

	// locations
	{
		name: 'zero_trust_gateway_locations_list',
		description: 'List Zero Trust Gateway Locations',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.gateway.locations.list({ account_id: accountId })
		},
	},
	{
		name: 'zero_trust_gateway_locations_get',
		description: 'Get Zero Trust Gateway Location',
		params: { locationId: z.string() },
		handler: async ({
			accountId,
			apiToken,
			locationId,
		}: {
			accountId: string
			apiToken: string
			locationId: string
		}) =>
			await getCloudflareClient(apiToken).zeroTrust.gateway.locations.get(locationId, {
				account_id: accountId,
			}),
	},

	// lists
	{
		name: 'zero_trust_gateway_lists_list',
		description: 'List Zero Trust Gateway Lists',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) => {
			const client = getCloudflareClient(apiToken)
			return await client.zeroTrust.gateway.lists.list({ account_id: accountId })
		},
	},
	{
		name: 'zero_trust_gateway_lists_get',
		description: 'Get Zero Trust Gateway List',
		params: { listId: z.string() },
		handler: async ({
			accountId,
			apiToken,
			listId,
		}: {
			accountId: string
			apiToken: string
			listId: string
		}) =>
			await getCloudflareClient(apiToken).zeroTrust.gateway.lists.get(listId, {
				account_id: accountId,
			}),
	},
	{
		name: 'zero_trust_gateway_lists_get_list_items',
		description: 'Get Zero Trust Gateway List Items',
		params: { listId: z.string() },
		handler: async ({
			accountId,
			apiToken,
			listId,
		}: {
			accountId: string
			apiToken: string
			listId: string
		}) =>
			await getCloudflareClient(apiToken).zeroTrust.gateway.lists.items.list(listId, {
				account_id: accountId,
			}),
	},

	// configurations
	{
		name: 'zero_trust_gateway_configuration_get',
		description: 'Get Zero Trust Gateway Configuration',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) =>
			await getCloudflareClient(apiToken).zeroTrust.gateway.configurations.get({
				account_id: accountId,
			}),
	},
	{
		name: 'zero_trust_gateway_configuration_custom_certificate_get',
		description: 'Get Zero Trust Gateway Configuration Custom Certificate',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) =>
			await getCloudflareClient(apiToken).zeroTrust.gateway.configurations.customCertificate.get({
				account_id: accountId,
			}),
	},

	// certificates
	{
		name: 'zero_trust_gateway_certificates_list',
		description: 'List Zero Trust Gateway Certificates',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) =>
			await getCloudflareClient(apiToken).zeroTrust.gateway.certificates.list({
				account_id: accountId,
			}),
	},
	{
		name: 'zero_trust_gateway_certificates_get',
		description: 'Get Zero Trust Gateway Certificate',
		params: {
			certificateId: z.string(),
		},
		handler: async ({
			accountId,
			apiToken,
			certificateId,
		}: {
			accountId: string
			apiToken: string
			certificateId: string
		}) =>
			await getCloudflareClient(apiToken).zeroTrust.gateway.certificates.get(certificateId, {
				account_id: accountId,
			}),
	},

	// categories
	{
		name: 'zero_trust_gateway_categories_list',
		description: 'List Zero Trust Gateway Categories',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) =>
			await getCloudflareClient(apiToken).zeroTrust.gateway.categories.list({
				account_id: accountId,
			}),
	},

	// audit ssh settings
	{
		name: 'zero_trust_gateway_audit_ssh_settings_get',
		description: 'Get Zero Trust Gateway Audit SSH Settings',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) =>
			await getCloudflareClient(apiToken).zeroTrust.gateway.auditSSHSettings.get({
				account_id: accountId,
			}),
	},

	// app types
	{
		name: 'zero_trust_gateway_app_types_list',
		description: 'List Zero Trust Gateway App Types',
		params: {},
		handler: async ({ accountId, apiToken }: { accountId: string; apiToken: string }) =>
			await getCloudflareClient(apiToken).zeroTrust.gateway.appTypes.list({
				account_id: accountId,
			}),
	},
]

/**
 * Registers the logs analysis tool with the MCP server
 * @param agent The MCP server instance
 */
export function registerZeroTrustGatewayTools(agent: CASBMCP) {
	toolDefinitions.forEach(({ name, description, params, handler }) => {
		agent.server.tool(name, description, params, withAccountCheck(agent, handler))
	})
}
