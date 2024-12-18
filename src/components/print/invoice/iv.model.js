import { Typography } from "antd";
import { comma } from "../../../utils/util";

export const column = [
  {
    title: (
      <>
        ลำดับ
        <br />
        No.
      </>
    ),
    key: "index",
    align: "center",
    width: "5%",
    render: (_, record, idx) => (
      <Typography.Text className="tx-info">{idx + 1}</Typography.Text>
    ),
  },
  {
    title: (
      <div style={{ textAlign: "center" }}>
        เลขที่ใบกำกับ
        <br />
       Invoice No.
      </div>
    ),
    align: "left",
    width: "15%",
    key: "stcode",
    dataIndex: "stcode",
  },
  {
    title: (
      <div style={{ textAlign: "center" }}>
        ลงวันที่
        <br />
        Date
      </div>
    ),
    align: "left",
    key: "stname",
    width: "10%",
    dataIndex: "stname",
  },
  {
    title: (
      <div style={{ textAlign: "center" }}>
        วันที่ครบกำหนด
        <br />
        Due Date
      </div>
    ),
    align: "left",
    key: "stname",
    width: "10%",
    dataIndex: "stname",
  },
  {
    title: (
      <>
        จำนวนเงิน
        <br />
        Amount
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
      <div style={{ textAlign: "center" }}>
        หมายเหตุ
        <br />
        Remark
      </div>
    ),
    align: "right",
    width: "30%",
    key: "remark",
    dataIndex: "remark",
    onCell: () => ({
      style: {
        borderRight: "1px solid ",
      },
    }),
    render: (v) => (
      <Typography.Text className="tx-info">{comma(Number(v))}</Typography.Text>
    ),
  },
];
