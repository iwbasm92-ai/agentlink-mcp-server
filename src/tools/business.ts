/**
 * AgentLink Korea - Business Registration Tools (사업자 정보 도구)
 *
 * Tools for verifying and retrieving Korean business registration data.
 * Sources: National Tax Service (국세청), Business Registration Portal.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { DataProvider } from "../types/index.js";

export function registerBusinessTools(server: McpServer, provider: DataProvider): void {
  /**
   * verify_business_registration — 사업자등록번호 진위 확인
   * Verify whether a Korean business registration number is valid and active.
   */
  server.tool(
    "verify_business_registration",
    "Verify the validity of a Korean business registration number (사업자등록번호 진위 확인)",
    {
      business_number: z
        .string()
        .regex(/^\d{3}-\d{2}-\d{5}$/, "Format: 000-00-00000")
        .describe("Business registration number to verify (사업자등록번호)"),
    },
    async ({ business_number }) => {
      const result = await provider.fetchBusinessData({
        tool: "verify_business_registration",
        business_number,
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
   * get_business_info — 사업자 상세 정보 조회
   * Retrieve detailed information about a registered Korean business.
   */
  server.tool(
    "get_business_info",
    "Retrieve detailed info about a registered Korean business entity (사업자 상세 정보 조회)",
    {
      business_number: z
        .string()
        .regex(/^\d{3}-\d{2}-\d{5}$/, "Format: 000-00-00000")
        .describe("Business registration number (사업자등록번호)"),
      include_financial: z
        .boolean()
        .default(false)
        .describe("Include basic financial summary if available (재무 요약 포함 여부)"),
    },
    async ({ business_number, include_financial }) => {
      const result = await provider.fetchBusinessData({
        tool: "get_business_info",
        business_number,
        include_financial,
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
