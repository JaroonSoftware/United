import { Badge, Space } from "antd";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
// import dayjs from 'dayjs';

export const accessColumn = ({ handleEdit, handleDelete, handleView }) => [
  {
    title: "รหัสลูกค้า",
    key: "cuscode",
    dataIndex: "cuscode",
    width: "10%",
    align: "left",
    sorter: (a, b) => (a?.cuscode || "").localeCompare(b?.cuscode || ""),
  },
  {
    title: "ชื่อลูกค้า",
    dataIndex: "cusname",
    key: "cusname",
    sorter: (a, b) => (a?.cusname || "").localeCompare(b?.cusname || ""),
  },
  {
    title: "ประเภทลูกค้า",
    dataIndex: "cus_type",
    key: "cus_type",
    width: "10%",
    sorter: (a, b) => (a?.cus_type || "").localeCompare(b?.cus_type || ""),
  },
  {
    title: "จังหวัด",
    dataIndex: "province",
    key: "province",
    width: "10%",
    sorter: (a, b) => (a?.province || "").localeCompare(b?.province || ""),
  },
  {
    title: "เบอร์โทร",
    dataIndex: "tel",
    key: "tel",
    width: "10%",
    sorter: (a, b) => (a?.tel || "").localeCompare(b?.tel || ""),
  },
  {
    title: "สถานะ",
    dataIndex: "active_status",
    key: "active_status",
    width: "10%",
    sorter: (a, b) => (a?.active_status || "").localeCompare(b?.active_status || ""),
    render: (data) => (
      <div>
        {data === "Y" ? (
          <Badge status="success" text="เปิดการใช้งาน" />
        ) : (
          <Badge status="error" text="ปิดการใช้การ" />
        )}
      </div>
    ),
  },
  {
    title: "Action",
    key: "operation",
    width: "10%",
    fixed: "right",
    render: (text, record) => (
      <Space>
        <Button
          icon={<EditOutlined />}
          className="bn-primary-outline"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => handleEdit(record)}
          size="small"
        />
      </Space>
    ),
  },
];

export const Items = {
  id: null,
  stcode: null,
  stname: null,
  prename: null,
  idno: null,
  road: null,
  subdistrict: null,
  district: null,
  province: null,
  zipcode: null,
  country: null,
  delidno: null,
  delroad: null,
  delsubdistrict: null,
  deldistrict: null,
  delprovince: null,
  delzipcode: null,
  delcountry: null,
  tel: null,
  fax: null,
  taxnumber: null,
  email: null,
  active_status: "Y",
};
