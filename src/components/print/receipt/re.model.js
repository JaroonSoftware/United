import { Typography } from "antd";
import { comma } from "../../../utils/util";
const calTotalDiscount = (rec) => {
  const total = Number(rec?.qty || 0) * Number(rec?.price || 0);
  const discount = 1 - Number(rec?.discount || 0) / 100;

  return total * discount;
};
export const column = [
  {
    title: (
      <>
        รหัสสินค้า
        <br />
        Product Code
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
        รหัสสินค้า
        <br />
        Code
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
        Quantity
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
      <>
        หน่วยละ
        <br />
        Unit
      </>
    ),
    align: "center",
    key: "price",
    dataIndex: "price",
    width: "10%",
  },
  {
    title: (
      <>
        ส่วนลด
        <br />
        Discount
      </>
    ),
    align: "center",
    key: "discount",
    dataIndex: "discount",
    width: "10%",
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
    render: (_, rec) => <>{comma(calTotalDiscount(rec), 2, 2)}</>,
  },
];
