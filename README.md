# AgentLink Korea MCP Server

**AI agents' gateway to Korean public & financial data**
**AI 에이전트를 위한 한국 공공·재무 데이터 게이트웨이**

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that provides AI agents with structured access to Korean government and financial data sources — including HomeTax (홈택스), KONEPS (나라장터), Supreme Court (대법원), and more.

## Available Tools

### Tax Data (세무 데이터)
| Tool | Description |
|------|-------------|
| `get_vat_data` | Retrieve VAT data for a business (부가가치세 데이터 조회) |
| `get_tax_invoice` | Look up electronic tax invoices (전자세금계산서 조회) |
| `get_income_tax_summary` | Retrieve income tax summary (소득세 요약 조회) |

### Business Registration (사업자 정보)
| Tool | Description |
|------|-------------|
| `verify_business_registration` | Verify a business registration number (사업자등록번호 진위 확인) |
| `get_business_info` | Retrieve detailed business info (사업자 상세 정보 조회) |

### Public Data (공공 데이터)
| Tool | Description |
|------|-------------|
| `search_public_notices` | Search government notices (공공 고시/공고 검색) |
| `get_procurement_data` | Retrieve procurement/bidding data from KONEPS (조달청 입찰/계약 데이터 조회) |

### Legal Data (법률 데이터)
| Tool | Description |
|------|-------------|
| `search_court_precedents` | Search court precedents (대법원 판례 검색) |

### Disaster & Safety (재난 안전)
| Tool | Description |
|------|-------------|
| `get_disaster_alerts` | Retrieve disaster alerts from MOIS (행정안전부 재난 알림 조회) |

## Quick Start

### Installation

```bash
npm install
npm run build
```

### Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agentlink-korea": {
      "command": "node",
      "args": ["/path/to/agentlink-mcp-server/dist/index.js"]
    }
  }
}
```

### Usage with Claude Code

```bash
claude mcp add agentlink-korea node /path/to/agentlink-mcp-server/dist/index.js
```

### Direct Execution

```bash
npx agentlink-mcp-server
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

## Architecture

```
agentlink-mcp-server (Public - this repo)
├── MCP tool definitions & schemas
├── Transport layer (stdio / HTTP)
└── DataProvider interface
        │
        ▼
agentlink-core-engine (Private)
├── Data crawling & aggregation
├── Data normalization pipeline
└── Source-specific adapters
        │
        ▼
agentlink-billing-x402 (Private)
├── x402 micropayment processing
├── Usage metering
└── Wallet management
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[Apache-2.0](LICENSE)
