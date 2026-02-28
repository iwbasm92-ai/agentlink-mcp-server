/**
 * AgentLink Korea - Legal Data Tools (법률 데이터 도구)
 *
 * Tools for searching Korean court precedents and legal data.
 * Source: Supreme Court of Korea (대법원) case database.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { DataProvider } from "../types/index.js";

export function registerLegalTools(server: McpServer, provider: DataProvider): void {
  /**
   * search_court_precedents — 대법원 판례 검색
   * Search Korean court precedents and judicial decisions.
   */
  server.tool(
    "search_court_precedents",
    "Search Korean court precedents and judicial decisions (대법원 판례 검색)",
    {
      keyword: z
        .string()
        .min(1)
        .max(300)
        .describe("Search keyword or legal term (검색 키워드 또는 법률 용어)"),
      court_type: z
        .enum(["all", "supreme", "high", "district", "patent", "family"])
        .default("all")
        .describe("Court type: supreme (대법원), high (고등법원), district (지방법원), patent (특허법원), family (가정법원)"),
      case_type: z
        .enum(["all", "civil", "criminal", "administrative", "tax", "labor", "commercial"])
        .default("all")
        .describe("Case type: civil (민사), criminal (형사), administrative (행정), tax (세무), labor (노동), commercial (상사)"),
      date_from: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
        .optional()
        .describe("Judgment date start (판결일 시작)"),
      date_to: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
        .optional()
        .describe("Judgment date end (판결일 종료)"),
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
        .max(50)
        .default(10)
        .describe("Results per page (페이지당 결과 수)"),
    },
    async ({ keyword, court_type, case_type, date_from, date_to, page, page_size }) => {
      const result = await provider.fetchLegalData({
        tool: "search_court_precedents",
        keyword,
        court_type,
        case_type,
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
