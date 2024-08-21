import { Table, Column, Model, DataType } from "sequelize-typescript";

/*
INSERT INTO fin.batch_transactions
                    (booking_date, value_date, remittance_info, reference,
                    amount, discount, currency, credit_debit_indicator, batch_id)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
*/
@Table
export class BatchTransaction extends Model {
  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
    comment: "The famous identifier",
  })
  batchTransactionId: number;

  @Column(DataType.CHAR)
  bookingDate: string;

  @Column(DataType.CHAR)
  valueDate: string;

  @Column(DataType.CHAR)
  remittanceInfo: string;

  @Column(DataType.CHAR)
  reference: string;

  @Column(DataType.FLOAT)
  discount: number;

  @Column(DataType.FLOAT)
  amount: number;

  @Column(DataType.BOOLEAN)
  posted: boolean;

  @Column(DataType.CHAR)
  creditDebitIndicator: string;

  @Column(DataType.CHAR)
  batchId: string;

  @Column(DataType.DATE)
  date: Date;
}
