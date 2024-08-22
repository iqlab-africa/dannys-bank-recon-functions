import { DefaultAzureCredential } from "@azure/identity";
import { KeyVaultSecret, SecretClient } from "@azure/keyvault-secrets";
import { Sequelize } from "sequelize-typescript";
import { ReadableStream } from "stream/web";
import { Batch } from "../models/batch";
import { BatchTransaction } from "../models/batch_transactions";
import { HttpRequest } from "@azure/functions";

const f0 = "robot-keys-2";
const f1 = ".vault";
const f2 = ".azure.net";
const h1 = "https://";

export async function convertStreamToString(stream: ReadableStream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  return result;
}
/**
 * Returns a secret from Azure Key Vault
 * @param keyName
 * @returns a secret string or null if not found
 */
export async function getSecret(keyName: string): Promise<string> {
  const vault_url = `${h1}${f0}${f1}${f2}/`;
  console.log(`🍐 key vault: ${vault_url}`);
  let result: string | PromiseLike<string>;
  try {
    const credential = new DefaultAzureCredential();
    const client: SecretClient = new SecretClient(vault_url, credential);
    // Read the secret we created
    const encodedKeyName = encodeURIComponent(keyName);
    const secret: KeyVaultSecret = await client.getSecret(encodedKeyName);
    result = secret.value;
    console.log(
      `🍐 secret found: ${secret.name} - value: 🅿️ ${secret.value} 🅿️ for keyName: ${keyName}`
    );
    return result;
  } catch (error) {
    console.log(`👿 getSecret Failed for keyName: ${keyName}, error: ${error}`);
  }

  return result;
}
/**
 * Enable Sequelize data models to enable database access
 * @param dbJson
 * @returns
 */
export async function _setDataModels(dbJson: string): Promise<Sequelize> {
  const j = JSON.parse(dbJson);
  console.log(`💛 ...... set Data Models: ${dbJson}`);

  const sequelize = new Sequelize(j.dbName, j.user, j.password, {
    host: j.host,
    dialect: "postgres",
    database: j.dbName,
  });

  await sequelize.authenticate();

  sequelize.addModels([Batch, BatchTransaction]);
  // Batch.hasMany(BatchTransaction, { foreignKey: "batch_id" });
  // BatchTransaction.belongsTo(Batch, { foreignKey: "batch_id" });

  await sequelize.sync().catch((error) => {
    console.error("Error synchronizing tables:", error);
    throw new Error(`😈😈 Unable to create tables: ${error} 😈`);
  });

  // console.log("💛 💛 💛 Tables created successfully if needed");
  // console.log("💛 💛 💛 Data models have been set up");
  return sequelize;
}

async function prepareDB(request: HttpRequest): Promise<any> {
  let dbJson: any;
  if (request.url.includes("7071")) {
    dbJson = {
      dbName: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
    };
    await _setDataModels(JSON.stringify(dbJson));
  } else {
    dbJson = getSecret("database-connection-string");
    await _setDataModels(JSON.stringify(dbJson));
  }

  // console.log(
  //   `🍎 🍎 🍎 prepareDB completed, dbJson: ${JSON.stringify(dbJson)}`
  // );
}

async function processRequest(
  request: HttpRequest,
  operation: string
): Promise<any> {
  if (request.body) {
    await prepareDB(request);
    const requestBody = request.body;
    const jsonString = await convertStreamToString(requestBody);
    const json = JSON.parse(jsonString);
    // console.log(`🌸 🌸 incoming data: ${JSON.stringify(json)}`);

    switch (operation) {
      case "insertBatch":
        const instance = Batch.build(json);
        instance.sort_id = new Date().getTime();
        await instance.save();
        console.log(`🥬 🥬 Batch instance added OK 🥬\n\n`);
        return instance;

      case "insertBatchTransactions":
        const txs = [];
        let count = 0;
        if (!Array.isArray(json)) {
          throw new Error("This is not a list, Jack!");
        }
        console.log(
          `\n\n🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵 ............. input transactions: 🍎 ${json.length} 🍎`
        );
        count = await handleTx(json, txs, count);
        console.log(`🥬 🥬 ${count} transactions in output list; `);
        return txs;
        break;

      case "changeBatch":
        const b = await Batch.findOne({ where: { batch_id: json.batch_id } });
        if (b) {
          b.posted = json.posted;
          await b.save();
          console.log(
            `🥬 🥬 batch updated: ${json.batch_id} - posted: ${json.posted}`
          );
        } else {
          throw new Error(`batch ${json.batch_id} not found`);
        }
        return json.batch_id;

      default:
        throw new Error("Invalid operation");
    }
  }

  throw new Error(`No request body`);
}

async function handleTx(json: any[], txs: any[], count: number): Promise<any> {
  await Promise.all(
    json.map(async (element) => {
      const tx = BatchTransaction.build(element);
      tx.sort_id = new Date().getTime();
      try {
        await tx.save();
        txs.push(tx);
        console.log(
          `🔵 transaction #${count + 1} added to db: ${tx.batch_transaction_id}`
        );
        count++;
      } catch (e) {
        console.error(`👿 👿 👿 Unable to save transaction: ${e}`);
        throw e;
      }
    })
  );

  return count;
}

export async function insertBatch(request: HttpRequest): Promise<any> {
  return await processRequest(request, "insertBatch");
}

export async function insertBatchTransactions(
  request: HttpRequest
): Promise<any> {
  return await processRequest(request, "insertBatchTransactions");
}

export async function changeBatch(request: HttpRequest): Promise<any> {
  return await processRequest(request, "changeBatch");
}
