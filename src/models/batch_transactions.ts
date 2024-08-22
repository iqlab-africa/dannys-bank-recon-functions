import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  PrimaryKey,
} from "sequelize-typescript";
import { Batch } from "./batch";

@Table
export class BatchTransaction extends Model {
  @Column({
    primaryKey: true,
    type: DataType.CHAR, // Assuming it should be an integer
    unique: true,
  })
  batch_transaction_id: string;

  @Column(DataType.CHAR)
  booking_date: string;

  @Column(DataType.CHAR)
  value_date: string;

  @Column(DataType.CHAR)
  remittance_info: string;

  @Column(DataType.CHAR)
  reference: string;

  @Column(DataType.FLOAT)
  discount: number;

  @Column(DataType.FLOAT)
  amount: number;

  @Column(DataType.BOOLEAN)
  posted: boolean;

  @Column(DataType.CHAR)
  credit_debit_indicator: string;

  // Foreign key definition
  @Column(DataType.CHAR)
  batch_id: string;

  // Define association
  // @BelongsTo(() => Batch, { foreignKey: "batch_id" })
  // batch: Batch;
}