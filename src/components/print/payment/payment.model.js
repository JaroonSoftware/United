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
        รายการ
        <br />
       Description
      </div>
    ),
    align: "left",
    width: "20%",
    key: "ivcode",
    dataIndex: "ivcode",
  },
  {
    title: (
      <div style={{ textAlign: "center" }}>
        เช็คเลขที่
        <br />
    Cheque No.
      </div>
    ),
    align: "center",
    key: "",
    width: "10%",
    dataIndex: "",
    render: (v) => dayjs(v).format("DD/MM/YYYY"),
  },
  {
    title: (
      <div style={{ textAlign: "center" }}>
        ลงวันที่
        <br />
        Post Date
      </div>
    ),
    align: "center",
    key: "ivdate",
    width: "15%",
    dataIndex: "ivdate",
    render: (v) => dayjs(v).format("DD/MM/YYYY"),
  },
  {
    title: (
      <div style={{ textAlign: "center" }}>
      CD
      </div>
    ),
    align: "right",
    key: "",
    dataIndex: "",
    width: "5%",
  },
  {
    title: (
      <div style={{ textAlign: "center" }}>
        ตามบิลเลขที่
        <br />
     Invoice No.
      </div>
    ),
    align: "center",
    key: "ivcode",
    width: "15%",
    dataIndex: "ivcode",
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
    width: "20%",
    key: "total_price",
    dataIndex: "total_price",
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
