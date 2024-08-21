import { DefaultAzureCredential } from "@azure/identity";
import { KeyVaultSecret, SecretClient } from "@azure/keyvault-secrets";
import { Sequelize } from "sequelize-typescript";
import { ReadableStream } from "stream/web";
import { Batch } from "../models/batch";
import { BatchTransaction } from "../models/batch_transactions";

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
export async function setDataModels(dbJson: string): Promise<Sequelize> {
  const j = JSON.parse(dbJson);
  console.log(`💛 ...... setDataModels: ${dbJson}`);

  const sequelize = new Sequelize(j.dbname, j.user, j.password, {
    host: j.host,
    dialect: "postgres",
  });
  await sequelize.authenticate();

  sequelize.addModels([Batch, BatchTransaction]);
  // DevUser.hasMany(DevBook, { foreignKey: "userId" });
  // DevBook.belongsTo(DevUser, { foreignKey: "userId" });
  // Synchronize all models with the database
  await sequelize.sync().catch((error) => {
    console.error("Error synchronizing tables:", error);
    throw new Error(`😈😈 Unable to create tables: ${error} 😈`);
  });

  console.log("🍎🍎🍎 Tables created successfully");
  console.log(`🔵🔵 sequelize.config: ${JSON.stringify(sequelize.config)}`);
  console.log(`🔵🔵 sequelize.getDatabaseName: ${sequelize.getDatabaseName()}`);

  console.log("\n\n💛💛💛💛 Data models set up");
  return sequelize;
}
