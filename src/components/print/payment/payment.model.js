import { Typography } from "antd";
import { comma } from "../../../utils/util";
import dayjs from 'dayjs';
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
    key: "recode",
    dataIndex: "recode",
  },
  {
    title: (
      <div style={{ textAlign: "center" }}>
        ลงวันที่
        <br />
        Date
      </div>
    ),
    align: "center",
    key: "redate",
    width: "10%",
    dataIndex: "redate",
    render: (v) => dayjs(v).format("DD/MM/YYYY"),
  },
  {
    title: (
      <div style={{ textAlign: "center" }}>
        วันที่ครบกำหนด
        <br />
        Due Date
      </div>
    ),
    align: "center",
    key: "duedate",
    width: "10%",
    dataIndex: "duedate",
    render: (v) => dayjs(v).format("DD/MM/YYYY"),
  },
  {
    title: (
      <div style={{ textAlign: "center" }}>
        จำนวนเงิน
        <br />
        Amount
      </div>
    ),
    align: "right",
    key: "price",
    dataIndex: "price",
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
    align: "left",
    width: "30%",
    key: "remark",
    dataIndex: "remark",
    onCell: () => ({
      style: {
        borderRight: "1px solid ",
      },
    }),
  },
];
