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
        
        title: "ชื่อลูกค้า",
        dataIndex: "cusname",
        width: "50%",
        key: "cusname",
        render: (v, record) => <Link className="text-select" onClick={()=>handleChoose(record)}> {v}</Link>
      },
      {
        title: "ประเภทลูกค้า",
        dataIndex: "cus_type",
        width: "20%",
        key: "cus_type",
        render: (v, record) => <Link className="text-select" onClick={()=>handleChoose(record)}> {v}</Link>
      } 
    ]
  };