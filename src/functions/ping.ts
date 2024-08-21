import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { getSecret, setDataModels } from "../utils/util";
import { Batch } from "../models/batch";
require("dotenv").config();

export async function ping(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`🔵🔵 Http function processed request for url "${request.url}"`);

  if (request.url.includes("7071")) {
    const dbJson = {
      dbName: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
    };
    await setDataModels(JSON.stringify(dbJson));
  } else {
    const dbJson = getSecret("database-connection-string");
    await setDataModels(JSON.stringify(dbJson));
  }
  const name = request.query.get("name") || (await request.text()) || "world";
  console.log(`🔵🔵 name received from ping: ${name}`);
  const randomNumber = Math.floor(Math.random() * 10); // Generates a random number between 0 and 99
  console.log(`randomNumber: ${randomNumber}`);
  const b = new Batch();
  b.batchId = new Date().getTime();
  b.operatorName = "Operator One";
  b.posted = true;
  b.date = new Date();
  b.subTotal = 150 * randomNumber;
  b.total = 200 * randomNumber;
  b.batchDate = new Date().toISOString();
  b.branchCode = "BR001";
  b.discount = 5;

  await b.save();
  console.log(`\n🌿🌿 Batch has been written: id: ${b.batchId}\n\n`);

  return {
    body: `Hey ${name}, 🍏 let us start doing good for Dannys Bank Recons: ${new Date().toISOString()}`,
  };
}

app.http("ping", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: ping,
});

/*

number = 3.14159
print("{:.2f}".format(number))
import requests

def send_name_to_endpoint(name):
    url = 'http://localhost:7071/getDetails'
    payload = {'name': name}

    try:
        response = requests.post(url, data=payload)
        if response.status_code == 200:
            print("Request successful")
            print(response.text)  # Print the response from the server
        else:
            print(f"Request failed with status code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

# Example usage:
send_name_to_endpoint('John')
///////////////////////////////////////////////////////
 insert_batch_query = """
            INSERT INTO fin.batch (branch_code, batch_date, operator_name, sub_total, discount, total, posted)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING batch_id
            """
              
            batch_data = (branch_code, batch_date, operator_name, float(sub_total), float(discount), float(total), False)

 try:
            with db_conn.cursor() as cur:
                sql = """
                    INSERT INTO fin.batch_transactions
                    (booking_date, value_date, remittance_info, reference,
                    amount, discount, currency, credit_debit_indicator, batch_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """

                data = [
                    (
                        row['bookingDate'],
                        row['valueDate'],
                        row['remittanceInfo'],
                        row['reference'],
                        row['amount'],
                        row['discount'],
                        row['currency'],
                        row['availableCreditDebitIndicator'],
                        batch_id
                    )
                    for _, row in trans_df.iterrows()
                ]

                psycopg2.extras.execute_batch(cur, sql, data)
                db_conn.commit()

                print(f"Successfully inserted {len(data)} transactions.")

        except (Exception, psycopg2.Error) as error:
            print(f"Error inserting transactions: {error}")
            db_conn.rollback()


    def post_to_general_ledger(self, db, batch_id, total_amount):
        try:
            date_str = datetime.now().strftime("%Y-%m-%d")

            insert_ledger_query = """
            INSERT INTO fin.general_ledger (batch_id, posting_date, total_amount)
            VALUES (%s, %s, %s)
            """
            ledger_data = (batch_id, date_str, float(total_amount))

            with db.cursor() as cur:
                cur.execute(insert_ledger_query, ledger_data)

                update_batch_query = "UPDATE fin.batch SET posted = TRUE WHERE batch_id = %s"
                cur.execute(update_batch_query, (batch_id,))
                db.commit()

                print("Batch posted to the general ledger successfully.")

        except Exception as e:
            print("Error while posting to the general ledger:", e)
            db.rollback()

            ///////////////////////////////////////////////////

        batch_id_30_day = self.insert_batch(
            db_conn, 'BR001', 
            batch_date, 
            'Finance (Bot)',
            df_30_day['amount'].sum(), 
            df_30_day['discount'].sum(), 
            df_30_day['total'].sum()
        )
        
        if batch_id_30_day:
            self.insert_bank_transactions(db_conn, df_30_day, batch_id_30_day)
            if self.check_batch_balance(df_30_day, df_30_day['amount'].sum(), df_30_day['discount'].sum(), df_30_day['total'].sum()):
                self.post_to_general_ledger(db_conn, 
                                            batch_id_30_day, 
                                            df_30_day['total'].sum())
                
                pdf_file_30_day = self.generate_pdf_report(df_30_day, batch_id_30_day, 
                                                           df_30_day['total'].sum(), 
                                                           df_30_day['discount'].sum(), 
                                                           '30-DAY')
                
                self.send_email_with_attachments(recipients, 
                                                 f'FNB 30-DAY BATCH {batch_id_30_day} - {current_date_str} - {current_time}', 
                                                 matched_email_body, 
                                                 pdf_file_30_day, raw_excel_file, 
                                                 'input/dannys_email_signature.png')

        batch_id_7_day = self.insert_batch(
            db_conn, 'BR001', 
            batch_date, 
            'Finance (Bot)',
            df_7_day['amount'].sum(), 
            df_7_day['discount'].sum(), 
            df_7_day['total'].sum()
        )

        if batch_id_7_day:
            self.insert_bank_transactions(db_conn, df_7_day, batch_id_7_day)
            if self.check_batch_balance(df_7_day, df_7_day['amount'].sum(), df_7_day['discount'].sum(), df_7_day['total'].sum()):
                self.post_to_general_ledger(db_conn, 
                                            batch_id_7_day, 
                                            df_7_day['total'].sum())
                
                pdf_file_7_day = self.generate_pdf_report(df_7_day, 
                                                          batch_id_7_day, 
                                                          df_7_day['total'].sum(), 
                                                          df_7_day['discount'].sum(), 
                                                          '7-DAY')
                
                self.send_email_with_attachments(recipients, 
                                                  f'FNB 7-DAY BATCH {batch_id_7_day} - {current_date_str} - {current_time}', 
                                                  matched_email_body, 
                                                  pdf_file_7_day, 
                                                  raw_excel_file, 
                                                  'input/dannys_email_signature.png')
        
        batch_id_cod = self.insert_batch(
            db_conn, 'BR001', batch_date, 'Finance (Bot)',
            df_cod['amount'].sum(),  df_cod['discount'].sum(), 
            df_cod['total'].sum()
        )
        
        if batch_id_cod:
            self.insert_bank_transactions(db_conn, df_cod, batch_id_cod)

            if self.check_batch_balance(df_cod, df_cod['amount'].sum(), df_cod['discount'].sum(), df_cod['total'].sum()):    
                self.post_to_general_ledger(db_conn, 
                                            batch_id_cod, 
                                            df_cod['total'].sum())
                
                pdf_file_cod = self.generate_pdf_report(df_cod, 
                                                        batch_id_cod, 
                                                        df_cod['total'].sum(), 
                                                        df_cod['discount'].sum(), 
                                                        'CASH ONLY (NOTES)')
                
                self.send_email_with_attachments(recipients, 
                                                  f'FNB CASH ONLY (COD) BATCH {batch_id_cod} - {current_date_str} - {current_time}', 
                                                  matched_email_body, 
                                                  pdf_file_cod, 
                                                  raw_excel_file, 
                                                  'input/dannys_email_signature.png')
                

*/
