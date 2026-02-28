/**
 * AgentLink Korea - Common Types
 *
 * Shared type definitions for the MCP server interface.
 * The actual data providers will be implemented in the private core-engine repository.
 */

/** Standard response wrapper for all AgentLink tools */
export interface AgentLinkResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    message_ko?: string;
  };
  metadata?: {
    source: string;
    retrieved_at: string;
    cached: boolean;
  };
}

/** Data provider interface — implemented by core-engine (private repo) */
export interface DataProvider {
  fetchTaxData(params: Record<string, unknown>): Promise<AgentLinkResponse>;
  fetchBusinessData(params: Record<string, unknown>): Promise<AgentLinkResponse>;
  fetchPublicData(params: Record<string, unknown>): Promise<AgentLinkResponse>;
  fetchLegalData(params: Record<string, unknown>): Promise<AgentLinkResponse>;
  fetchDisasterData(params: Record<string, unknown>): Promise<AgentLinkResponse>;
}

/** Stub data provider for Phase 1 (returns placeholder responses) */
export class StubDataProvider implements DataProvider {
  private stubResponse(source: string): AgentLinkResponse {
    return {
      success: true,
      data: {
        status: "stub",
        message: "Core engine not connected. This is a placeholder response for development.",
        message_ko: "코어 엔진 미연결 상태입니다. 개발용 플레이스홀더 응답입니다.",
      },
      metadata: {
        source,
        retrieved_at: new Date().toISOString(),
        cached: false,
      },
    };
  }

  async fetchTaxData(_params: Record<string, unknown>): Promise<AgentLinkResponse> {
    return this.stubResponse("hometax");
  }

  async fetchBusinessData(_params: Record<string, unknown>): Promise<AgentLinkResponse> {
    return this.stubResponse("business-registry");
  }

  async fetchPublicData(_params: Record<string, unknown>): Promise<AgentLinkResponse> {
    return this.stubResponse("public-data-portal");
  }

  async fetchLegalData(_params: Record<string, unknown>): Promise<AgentLinkResponse> {
    return this.stubResponse("supreme-court");
  }

  async fetchDisasterData(_params: Record<string, unknown>): Promise<AgentLinkResponse> {
    return this.stubResponse("mois-disaster");
  }
}
