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
    width:  "12%",
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
    width: "5%",
    render: (v) => (
      <Typography.Text className="tx-info">{comma(Number(v))}</Typography.Text>
    ),
  },
  {
    title: (
      <div style={{textAlign: "center"}}>
        หมายเหตุ
        <br />
        Remark
      </div>
    ),
    align: "left",
    width: "30%",
    key: "remark",
    dataIndex: "remark",
    // onCell: () => ({
    //   style: {
    //    borderRight: "1px solid "
    //   },
    // }),
  }
];
