import { z } from 'zod'

import { withAccountCheck } from '@repo/mcp-common/src/api/account.api'
import { getCloudflareClient } from '@repo/mcp-common/src/cloudflare-api'

import type { EmailSecurityMCP } from '../email-security.app'

const PAGE_SIZE = 20

// Define tool parameters
const searchQueryParam = z
	.string()
	.optional()
	.describe(
		"Space-delimited search terms used to filter email messages. Matches various metadata fields such as subject, sender, hashes, etc. If omitted, all messages are returned."
	)

const startParam = z
	.string()
	.optional()
	.describe('ISO 8601 datetime string marking beginning of search range. Defaults to 30 days ago if omitted.')

const endParam = z
	.string()
	.optional()
	.describe('ISO 8601 datetime string marking end of search range. Defaults to now if omitted.')

export function registerEmailSecurityTools(agent: EmailSecurityMCP) {
	agent.server.tool(
		'email_security_search_messages',
		'Search Cloudflare Email Security messages via Investigate list endpoint',
		{ query: searchQueryParam, start: startParam, end: endParam },
		withAccountCheck<{
			query?: string
			start?: string
			end?: string
		}>(
			agent,
			async ({ query, start, end, accountId, apiToken }: {
				query?: string
				start?: string
				end?: string
				accountId: string | null
				apiToken: string
			}) => {
				const client = getCloudflareClient(apiToken)

				const params: any = { account_id: accountId }
				if (query) params.query = query
				if (start) params.start = start
				if (end) params.end = end
				// Limit page result count per_page to PAGE_SIZE
				params.per_page = PAGE_SIZE

				const messages: any[] = []
				try {
					for await (const item of client.emailSecurity.investigate.list(params)) {
						messages.push(item)
					}
				} catch (error) {
					return {
						error:
							error instanceof Error
								? error.message
								: 'Unknown error occurred while fetching messages',
					}
				}

				return {
					messagesCount: messages.length,
					messages,
				}
			}
		)
	)
}
