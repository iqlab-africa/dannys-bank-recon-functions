import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { insertBatch } from "../utils/util";
require("dotenv").config();

export async function addBatch(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`🔵🔵 Http function to be processed for url "${request.url}"`);

  try {
    const batch = await insertBatch(request);
    return {
      body: JSON.stringify(batch),
      status: 200,
    };
  } catch (e) {
    console.error(`😈 😈 😈 We have a problem: ${e}`);
    return {
      body: `Batch addition failed: ${e}`,
      status: 400,
    };
  }
}

app.http("addBatch", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: addBatch,
});
