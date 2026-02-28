/**
 * AgentLink Korea - Disaster & Safety Tools (재난 안전 도구)
 *
 * Tools for accessing Korean disaster alerts and safety information.
 * Source: Ministry of the Interior and Safety (행정안전부), National Disaster Safety Portal.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { DataProvider } from "../types/index.js";

export function registerDisasterTools(server: McpServer, provider: DataProvider): void {
  /**
   * get_disaster_alerts — 행정안전부 재난 알림 조회
   * Retrieve current disaster alerts and safety notifications from MOIS.
   */
  server.tool(
    "get_disaster_alerts",
    "Retrieve current disaster alerts and safety notifications in Korea (행정안전부 재난 알림 조회)",
    {
      region: z
        .enum([
          "all",
          "seoul",
          "busan",
          "daegu",
          "incheon",
          "gwangju",
          "daejeon",
          "ulsan",
          "sejong",
          "gyeonggi",
          "gangwon",
          "chungbuk",
          "chungnam",
          "jeonbuk",
          "jeonnam",
          "gyeongbuk",
          "gyeongnam",
          "jeju",
        ])
        .default("all")
        .describe("Region filter (지역 필터): Korean metropolitan cities and provinces"),
      alert_type: z
        .enum([
          "all",
          "earthquake",
          "typhoon",
          "flood",
          "heavy_rain",
          "heavy_snow",
          "heat_wave",
          "cold_wave",
          "fine_dust",
          "infectious_disease",
          "industrial_accident",
        ])
        .default("all")
        .describe("Alert type (재난 유형): earthquake (지진), typhoon (태풍), flood (홍수), etc."),
      severity: z
        .enum(["all", "emergency", "critical", "warning", "watch", "advisory"])
        .default("all")
        .describe("Severity level (심각도): emergency (긴급), critical (위험), warning (경보), watch (주의보), advisory (예비)"),
      include_expired: z
        .boolean()
        .default(false)
        .describe("Include expired/resolved alerts (해제된 알림 포함 여부)"),
    },
    async ({ region, alert_type, severity, include_expired }) => {
      const result = await provider.fetchDisasterData({
        tool: "get_disaster_alerts",
        region,
        alert_type,
        severity,
        include_expired,
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
