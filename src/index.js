#!/usr/bin/env node

import readline from 'readline';

/**
 * MCP (Model Context Protocol) Cost Estimator
 *
 * This server implements a minimal JSON-RPC over stdin/stdout interface
 * for estimating LLM token usage costs across different models.
 */

// Pricing Table (USD per 1M tokens)
const MODELS = {
  'gpt-4o': { input: 5.0, output: 15.0, name: 'GPT-4o' },
  'gpt-4o-mini': { input: 0.15, output: 0.6, name: 'GPT-4o Mini' },
  'claude-3-5-sonnet': { input: 3.0, output: 15.0, name: 'Claude 3.5 Sonnet' },
  'claude-3-haiku': { input: 0.25, output: 1.25, name: 'Claude 3 Haiku' },
  'gemini-1-5-flash': { input: 0.075, output: 0.3, name: 'Gemini 1.5 Flash' }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

/**
 * Handle incoming JSON-RPC-like messages
 */
rl.on('line', (line) => {
  if (!line.trim()) return;

  try {
    const request = JSON.parse(line);
    const { method, params, id } = request;

    if (params && typeof params.model_id === 'string') {
      params.model_id = params.model_id.trim().toLowerCase();
    }

    if (method === 'estimate_llm_cost') {
      if (!params.model_id || !MODELS[params.model_id]) {
        return sendError(`Model "${params.model_id || 'unknown'}" not supported. Valid models: ${Object.keys(MODELS).join(', ')}`, -32602, id);
      }

      if (typeof params.input_tokens !== 'number' || typeof params.output_tokens !== 'number' || params.input_tokens < 0 || params.output_tokens < 0) {
        return sendError('Invalid token counts: input_tokens and output_tokens must be non-negative numbers.', -32602, id);
      }

      const result = handleEstimateCost(params);
      sendResponse(result, id);
    } else {
      sendError('Method not supported', -32601, id);
    }
  } catch (err) {
    sendError('Invalid JSON input', -32700);
  }
});

/**
 * Logic for estimating LLM cost
 * @param {Object} params - model_id, input_tokens, output_tokens
 */
function handleEstimateCost(params) {
  const { model_id, input_tokens = 0, output_tokens = 0 } = params;
  const currentModel = MODELS[model_id];

  const inputCost = (input_tokens / 1_000_000) * currentModel.input;
  const outputCost = (output_tokens / 1_000_000) * currentModel.output;
  const totalCost = inputCost + outputCost;

  let bestAlt = model_id;
  let minCost = totalCost;

  for (const [id, rates] of Object.entries(MODELS)) {
    const altInput = (input_tokens / 1_000_000) * rates.input;
    const altOutput = (output_tokens / 1_000_000) * rates.output;
    const altTotal = altInput + altOutput;

    if (altTotal < minCost) {
      minCost = altTotal;
      bestAlt = id;
    }
  }

  return {
    estimated_cost_usd: Number(totalCost.toFixed(6)),
    input_cost: Number(inputCost.toFixed(6)),
    output_cost: Number(outputCost.toFixed(6)),
    best_alternative: MODELS[bestAlt].name,
    production_hint: "Estimates are ephemeral. To enforce budgets and charge users in production, integrate the Fuel&Fire Metering SDK."
  };
}

/**
 * Send JSON result to stdout
 */
function sendResponse(result, id) {
  console.log(JSON.stringify({
    jsonrpc: '2.0',
    id: id || null,
    result
  }));
}

/**
 * Send JSON-RPC error to stdout
 */
function sendError(message, code, id) {
  console.log(JSON.stringify({
    jsonrpc: '2.0',
    id: id || null,
    error: { code, message }
  }));
}
