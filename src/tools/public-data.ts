/**
 * AgentLink Korea - Public Data Tools (공공 데이터 도구)
 *
 * Tools for accessing Korean government public notices and procurement data.
 * Sources: Public Data Portal (공공데이터포털), KONEPS/조달청.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { DataProvider } from "../types/index.js";

export function registerPublicDataTools(server: McpServer, provider: DataProvider): void {
  /**
   * search_public_notices — 공공 고시/공고 검색
   * Search Korean government public notices and announcements.
   */
  server.tool(
    "search_public_notices",
    "Search Korean government public notices and announcements (공공 고시/공고 검색)",
    {
      keyword: z
        .string()
        .min(1)
        .max(200)
        .describe("Search keyword (검색 키워드)"),
      category: z
        .enum([
          "all",
          "policy",
          "budget",
          "regulation",
          "environment",
          "construction",
          "welfare",
          "education",
        ])
        .default("all")
        .describe("Notice category (공고 분류): policy (정책), budget (예산), regulation (규제), etc."),
      date_from: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
        .optional()
        .describe("Start date filter (검색 시작일)"),
      date_to: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
        .optional()
        .describe("End date filter (검색 종료일)"),
      page: z
        .number()
        .int()
        .min(1)
        .default(1)
        .describe("Page number for pagination (페이지 번호)"),
      page_size: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(20)
        .describe("Number of results per page (페이지당 결과 수)"),
    },
    async ({ keyword, category, date_from, date_to, page, page_size }) => {
      const result = await provider.fetchPublicData({
        tool: "search_public_notices",
        keyword,
        category,
        date_from,
        date_to,
        page,
        page_size,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  /**
   * get_procurement_data — 조달청 조달 데이터 조회
   * Retrieve procurement/bidding data from Korea ON-line E-Procurement System (KONEPS/나라장터).
   */
  server.tool(
    "get_procurement_data",
    "Retrieve procurement and bidding data from KONEPS (조달청 나라장터 입찰/계약 데이터 조회)",
    {
      keyword: z
        .string()
        .min(1)
        .max(200)
        .describe("Search keyword for procurement items (검색 키워드)"),
      bid_type: z
        .enum(["all", "open", "restricted", "negotiated", "emergency"])
        .default("all")
        .describe("Bid type: open (일반경쟁), restricted (제한경쟁), negotiated (수의계약), emergency (긴급)"),
      status: z
        .enum(["all", "announced", "in_progress", "closed", "awarded"])
        .default("all")
        .describe("Bid status: announced (공고), in_progress (진행중), closed (마감), awarded (낙찰)"),
      date_from: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
        .optional()
        .describe("Start date filter (검색 시작일)"),
      date_to: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
        .optional()
        .describe("End date filter (검색 종료일)"),
      page: z
        .number()
        .int()
        .min(1)
        .default(1)
        .describe("Page number (페이지 번호)"),
      page_size: z
        .number()
        .int()
        .min(1)
        .max(100)
        .default(20)
        .describe("Results per page (페이지당 결과 수)"),
    },
    async ({ keyword, bid_type, status, date_from, date_to, page, page_size }) => {
      const result = await provider.fetchPublicData({
        tool: "get_procurement_data",
        keyword,
        bid_type,
        status,
        date_from,
        date_to,
        page,
        page_size,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}
