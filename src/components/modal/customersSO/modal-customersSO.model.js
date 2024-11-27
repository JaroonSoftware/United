import { Typography } from "antd";


/** get items column */
export const customersColumn = ({handleChoose})=>{
    const Link = Typography.Link;
    return [
      {
        title: "รหัสประกัน",
        key: "cuscode",
        width: "30%",
        dataIndex: "cuscode", 
        render: (v, record) => <Link className="text-select" onClick={()=>handleChoose(record)}>{v}</Link>
      },
      {
        title: "ชื่อประกัน",
        dataIndex: "cusname",
        width: "70%",
        key: "cusname",
        render: (v, record) => <Link className="text-select" onClick={()=>handleChoose(record)}> {v}</Link>
      } 
    ]
  };