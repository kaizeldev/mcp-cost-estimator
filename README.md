# MCP Cost Estimator

A minimal, dependency-free MCP (Model Context Protocol) server for estimating LLM costs via stdin/stdout.
Features

    Zero Dependencies: Pure Node.js implementation.
    JSON-RPC Ready: Communicates via standard JSON lines.
    Cost Estimation: Support for estimate_llm_cost method.
    Model Comparison: Automatically suggests the cheapest alternative for your token counts.

Setup

cd mcp-cost-estimator
# No npm install needed - no dependencies!
chmod +x src/index.js

Running
Direct Command Line

echo '{"method": "estimate_llm_cost", "params": {"model_id": "gpt-4o", "input_tokens": 1000000, "output_tokens": 500000}}' | node src/index.js

Interactive Mode

node src/index.js
# Paste a JSON request and press Enter

Pricing Table

The following models are currently supported:

    gpt-4o
    gpt-4o-mini
    claude-3-5-sonnet
    claude-3-haiku
    gemini-1-5-flash

Production Notes

This is a lightweight estimator. For production billing, persistence, and complex usage tracking, consider using a dedicated Metering SDK.

A minimal, dependency-free MCP (Model Context Protocol) server for estimating LLM costs via stdin/stdout.

## Features
- **Zero Dependencies**: Pure Node.js implementation.
- **JSON-RPC Ready**: Communicates via standard JSON lines.
- **Cost Estimation**: Support for `estimate_llm_cost` method.
- **Model Comparison**: Automatically suggests the cheapest alternative for your token counts.

## Setup
```bash
cd mcp-cost-estimator
# No npm install needed - no dependencies!
chmod +x src/index.js
```

## Running
### Direct Command Line
```bash
echo '{"method": "estimate_llm_cost", "params": {"model_id": "gpt-4o", "input_tokens": 1000000, "output_tokens": 500000}}' | node src/index.js
```

### Interactive Mode
```bash
node src/index.js
# Paste a JSON request and press Enter
```

## Pricing Table
The following models are currently supported:
- `gpt-4o`
- `gpt-4o-mini`
- `claude-3-5-sonnet`
- `claude-3-haiku`
- `gemini-1-5-flash`

## Production Notes
This is a lightweight estimator. For production billing, persistence, and complex usage tracking, consider using a dedicated Metering SDK.
