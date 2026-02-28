/**
 * AgentLink Korea - Tax Data Tools (세무 데이터 도구)
 *
 * Tools for accessing Korean tax data from HomeTax (홈택스) and related sources.
 * Provides VAT data, tax invoices, and income tax summaries.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { DataProvider } from "../types/index.js";

export function registerTaxTools(server: McpServer, provider: DataProvider): void {
  /**
   * get_vat_data — 부가가치세 데이터 조회
   * Retrieve Value-Added Tax (VAT) data for a business entity.
   */
  server.tool(
    "get_vat_data",
    "Retrieve VAT (Value-Added Tax) data for a Korean business entity (부가가치세 신고/납부 데이터 조회)",
    {
      business_number: z
        .string()
        .regex(/^\d{3}-\d{2}-\d{5}$/, "Format: 000-00-00000")
        .describe("Business registration number (사업자등록번호, format: 000-00-00000)"),
      year: z
        .number()
        .int()
        .min(2000)
        .max(2030)
        .describe("Tax year (과세연도)"),
      quarter: z
        .number()
        .int()
        .min(1)
        .max(4)
        .describe("Quarter of the year, 1-4 (분기)"),
    },
    async ({ business_number, year, quarter }) => {
      const result = await provider.fetchTaxData({
        tool: "get_vat_data",
        business_number,
        year,
        quarter,
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
   * get_tax_invoice — 세금계산서 조회
   * Look up electronic tax invoices (e-Tax invoices) for a business.
   */
  server.tool(
    "get_tax_invoice",
    "Look up electronic tax invoices for a Korean business (전자세금계산서 조회)",
    {
      business_number: z
        .string()
        .regex(/^\d{3}-\d{2}-\d{5}$/, "Format: 000-00-00000")
        .describe("Business registration number (사업자등록번호)"),
      date_from: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
        .describe("Start date for the search range (조회 시작일)"),
      date_to: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
        .describe("End date for the search range (조회 종료일)"),
      direction: z
        .enum(["sales", "purchases", "both"])
        .default("both")
        .describe("Invoice direction: 'sales' (매출), 'purchases' (매입), or 'both' (전체)"),
    },
    async ({ business_number, date_from, date_to, direction }) => {
      const result = await provider.fetchTaxData({
        tool: "get_tax_invoice",
        business_number,
        date_from,
        date_to,
        direction,
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
   * get_income_tax_summary — 소득세 요약 조회
   * Retrieve an income tax summary for a given tax year.
   */
  server.tool(
    "get_income_tax_summary",
    "Retrieve income tax summary for a Korean taxpayer (소득세 신고 요약 조회)",
    {
      business_number: z
        .string()
        .regex(/^\d{3}-\d{2}-\d{5}$/, "Format: 000-00-00000")
        .describe("Business registration number (사업자등록번호)"),
      tax_year: z
        .number()
        .int()
        .min(2000)
        .max(2030)
        .describe("Tax year to query (과세연도)"),
      tax_type: z
        .enum(["comprehensive", "global", "retirement", "capital_gains"])
        .default("comprehensive")
        .describe("Type of income tax: comprehensive (종합소득세), global (양도소득세), retirement (퇴직소득세), capital_gains (금융투자소득세)"),
    },
    async ({ business_number, tax_year, tax_type }) => {
      const result = await provider.fetchTaxData({
        tool: "get_income_tax_summary",
        business_number,
        tax_year,
        tax_type,
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
