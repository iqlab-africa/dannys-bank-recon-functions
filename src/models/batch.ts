import { Table, Column, Model, DataType } from "sequelize-typescript";

//            INSERT INTO fin.batch (branch_code, batch_date, operator_name, sub_total, discount, total, posted)

@Table
export class Batch extends Model {
  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
    comment: "The famous identifier",
  })
  batchId: number;

  @Column(DataType.CHAR)
  branchCode: string;

  @Column(DataType.CHAR)
  batchDate: string;

  @Column(DataType.CHAR)
  operatorName: string;

  @Column(DataType.FLOAT)
  subTotal: number;

  @Column(DataType.FLOAT)
  discount: number;

  @Column(DataType.FLOAT)
  total: number;

  @Column(DataType.BOOLEAN)
  posted: boolean;

  @Column(DataType.DATE)
  date: Date;
}