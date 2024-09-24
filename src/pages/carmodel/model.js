import { Badge, Space } from "antd";
import { Button } from "antd";
// import { PrinterOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
// import dayjs from 'dayjs';

export const accessColumn = ({ handleEdit, handleDelete, handleView }) => [
  {
    title: "รหัสประเภทสินค้า",
    key: "car_model_code",
    dataIndex: "car_model_code",
    align: "left",
    hidden: true,
    sorter: (a, b) => (a?.car_model_code || "").localeCompare(b?.car_model_code || ""),
  },
  {
    title: "ชื่อสินค้า",
    dataIndex: "car_model_name",
    key: "car_model_name",
    width: "30%",
    sorter: (a, b) => (a?.car_model_name || "").localeCompare(b?.car_model_name || ""),
  },
  {
    title: "ยี่ห้อ",
    dataIndex: "brand_name",
    key: "brand_name",
    width: "15%",
    sorter: (a, b) => (a?.brand_name || "").localeCompare(b?.brand_name || ""),
  },
  {
    title: "ยี่ห้อ",
    dataIndex: "model_name",
    key: "model_name",
    width: "15%",
    sorter: (a, b) => (a?.model_name || "").localeCompare(b?.model_name || ""),
  },
  {
    title: "ปี",
    dataIndex: "year",
    key: "year",
    width: "15%",
    sorter: (a, b) => (a?.year || "").localeCompare(b?.year || ""),
  },
  {
    title: "สถานะ",
    dataIndex: "active_status",
    key: "active_status",
    width: "20%",
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
