import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { insertBatch, insertBatchTransactions } from "../utils/util";
require("dotenv").config();

export async function addBatchTransactions(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`🔵🔵 Http function to be processed for url ${request.url}\n`);

  try {
    const txs = await insertBatchTransactions(request);
    console.log(`\n\n🅿️ 🅿️ 🅿️ Batch transactions processed: ${txs.length}\n\n`);
    return {
      body: JSON.stringify(txs),
      status: 200,
    };
  } catch (e) {
    console.error(`😈 😈 😈 We have a problem: ${e}`);

    return {
      body: `Batch transactions failed: ${e}`,
      status: 400,
    };
  }
}

app.http("addBatchTransactions", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: addBatchTransactions,
});
