import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { changeBatch } from "../utils/util";
require("dotenv").config();

export async function updateBatch(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`🔵🔵 Http function to be processed for url "${request.url}"`);

  try {
    console.log(`🚼🚼🚼🚼 update batch ..... 🚼`);
    const batchId = await changeBatch(request);
    return {
      body: `Batch ${batchId} updated`,
      status: 200,
    };
  } catch (e) {
    console.error(`😈 😈 😈 We have a problem: ${e}`);

    return {
      body: `Batch update failed: ${e}`,
      status: 400,
    };
  }
}

app.http("updateBatch", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: updateBatch,
});
