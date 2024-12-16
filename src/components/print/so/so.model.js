import { Typography } from "antd";
import { comma } from "../../../utils/util";

export const column = [
  {
    title: (
      <>
        ลำดับ
        <br />No.
      </>
    ),
    key: "index",
    align: "center",
    width:  "5%",
    render: (_, record, idx) => (
      <Typography.Text className="tx-info">{idx + 1}</Typography.Text>
    ),
  },
  {
    title: (
      <div  style={{textAlign: "center"}}>
       รหัสสินค้า
        <br />
       Code
      </div>
    ),
    align: "left",
    width:  "15%",
    key: "stcode",
    dataIndex: "stcode",
  },
  {
    title: (
      <div style={{textAlign: "center"}}> 
       รายละเอียด
        <br />
       Description
      </div>
    ),
    align: "left",
    key: "stname",
    width: "30%",
    dataIndex: "stname",
  },
  {
    title: (
      <>
        จำนวน
        <br />
        Qty.
      </>
    ),
    align: "center",
    key: "qty",
    dataIndex: "qty",
    width: "10%",
    render: (v) => (
      <Typography.Text className="tx-info">{comma(Number(v))}</Typography.Text>
    ),
  },
  {
    title: (
      <div style={{textAlign: "center"}}>
        ราคาต่อหน่วย
        <br />
        Unit Price
      </div>
    ),
    align: "right",
    width: "10%",
    key: "price",
    dataIndex: "price",
    render: (v) => (
      <Typography.Text className="tx-info">{comma(Number(v))}</Typography.Text>
    ),
  },
  {
    title: (
      <div style={{textAlign: "center"}}>
        ส่วนลด
        <br />
        Discount(%)
      </div>
    ),
    align: "right",
    width:  "10%",
    key: "discount",
    dataIndex: "discount",
  },
  {
    title: (
      <div style={{textAlign: "center"}}>
        จำนวนเงิน
        <br />
        Total
      </div>
    ),
    align: "right",
    width:  "10%",
    key: "amount",
    dataIndex: "amount",
    onCell: () => ({
      style: {
       borderRight: "1px solid "
      },
    }),
    render: (_, record) => (
      <Typography.Text className="tx-info">
        {comma(Number(record.price * record.qty), 2, 2)}
      </Typography.Text>
    ),
  },
];
