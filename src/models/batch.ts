import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript";
import { BatchTransaction } from "./batch_transactions";

@Table
export class Batch extends Model {
  @Column({
    primaryKey: true,
    type: DataType.CHAR,
    unique: true,
    comment: "The famous identifier",
  })
  batch_id: string;

  @Column(DataType.CHAR)
  branch_code: string;

  @Column(DataType.CHAR)
  batch_date: string;

  @Column(DataType.CHAR)
  operator_name: string;

  @Column(DataType.FLOAT)
  sub_total: number;

  @Column(DataType.FLOAT)
  discount: number;

  @Column(DataType.FLOAT)
  total: number;

  @Column(DataType.BOOLEAN)
  posted: boolean;

 

  // Define association
  // @HasMany(() => BatchTransaction, { foreignKey: "batch_id" })
  // transactions: BatchTransaction[];
}

