import { InvestigateListParams } from 'cloudflare/resources/email-security.mjs'
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
		'Space-delimited search terms used to filter email messages. Matches various metadata fields such as subject, sender, hashes, etc. If omitted, all messages are returned.'
	)

const startParam = z
	.string()
	.optional()
	.describe(
		'ISO 8601 datetime string marking beginning of search range. Defaults to 30 days ago if omitted.'
	)

const endParam = z
	.string()
	.optional()
	.describe('ISO 8601 datetime string marking end of search range. Defaults to now if omitted.')

// Boolean flags
const actionLogParam = z
	.boolean()
	.optional()
	.describe('Include the message action log in response when true.')

const detectionsOnlyParam = z
	.boolean()
	.optional()
	.describe('When true, results include only detection information.')

// Simple string params
const alertIdParam = z.string().optional().describe('Filter by alert_id')
const domainParam = z.string().optional().describe('Filter by sender domain')
const messageIdParam = z.string().optional().describe('Filter by message_id')
const metricParam = z.string().optional().describe('Metric filter (reserved)')
const recipientParam = z.string().optional().describe('Filter by recipient email')
const senderParam = z.string().optional().describe('Filter by sender email')

// Enumerations
const finalDispositionParam = z
	.enum(['MALICIOUS', 'MALICIOUS-BEC', 'SUSPICIOUS', 'SPOOF', 'BENIGN', 'UNKNOWN'])
	.optional()
	.describe('Filter by final disposition')

const messageActionParam = z
	.enum(['PREVIEW', 'QUARANTINE_RELEASED', 'MOVED'])
	.optional()
	.describe('Filter by message action')

// Pagination
const pageParam = z.number().int().positive().optional().describe('Result page number')
const perPageParam = z
	.number()
	.int()
	.positive()
	.max(100)
	.optional()
	.describe('Results per page (max 100)')

export function registerEmailSecurityTools(agent: EmailSecurityMCP) {
	agent.server.tool(
		'email_security_search_messages',
		'Search Cloudflare Email Security messages via Investigate list endpoint',
		{
			query: searchQueryParam,
			start: startParam,
			end: endParam,
			actionLog: actionLogParam,
			alertId: alertIdParam,
			detectionsOnly: detectionsOnlyParam,
			domain: domainParam,
			finalDisposition: finalDispositionParam,
			messageAction: messageActionParam,
			messageId: messageIdParam,
			metric: metricParam,
			page: pageParam,
			perPage: perPageParam,
			recipient: recipientParam,
			sender: senderParam,
		},
		withAccountCheck<{
			query?: string
			start?: string
			end?: string
			actionLog?: boolean
			alertId?: string
			detectionsOnly?: boolean
			domain?: string
			finalDisposition?: string
			messageAction?: string
			messageId?: string
			metric?: string
			page?: number
			perPage?: number
			recipient?: string
			sender?: string
		}>(
			agent,
			async ({
				query,
				start,
				end,
				actionLog,
				alertId,
				detectionsOnly,
				domain,
				finalDisposition,
				messageAction,
				messageId,
				metric,
				page,
				perPage,
				recipient,
				sender,
			}: {
				query?: string
				start?: string
				end?: string
				actionLog?: boolean
				alertId?: string
				detectionsOnly?: boolean
				domain?: string
				finalDisposition?: string
				messageAction?: string
				messageId?: string
				metric?: string
				page?: number
				perPage?: number
				recipient?: string
				sender?: string
			}) => {
				const accountId = await agent.getActiveAccountId()
				const client = getCloudflareClient(agent.props.accessToken)

				const params: InvestigateListParams = { account_id: accountId || '' }
				if (query) params.query = query
				if (start) params.start = start
				if (end) params.end = end
				if (actionLog !== undefined) params.action_log = actionLog
				if (alertId) params.alert_id = alertId
				if (detectionsOnly !== undefined) params.detections_only = detectionsOnly
				if (domain) params.domain = domain
				// @ts-ignore
				if (finalDisposition) params.final_disposition = finalDisposition
				// @ts-ignore
				if (messageAction) params.message_action = messageAction
				if (messageId) params.message_id = messageId
				if (metric) params.metric = metric
				if (page) params.page = page
				params.per_page = perPage ?? PAGE_SIZE
				if (recipient) params.recipient = recipient
				if (sender) params.sender = sender

				try {
					const { result, result_info: resultInfo } =
						await client.emailSecurity.investigate.list(params)

					return { result, resultInfo }
				} catch (error) {
					return {
						error:
							error instanceof Error
								? error.message
								: 'Unknown error occurred while fetching messages',
					}
				}
			}
		)
	)
}
