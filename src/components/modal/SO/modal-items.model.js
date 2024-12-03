/** get items column */
export const columns = ()=>{
  return [
    {
      title: "รหัสใบขาย",
      key: "socode",
      dataIndex: "socode", 
      width: "10%",
    },
    {
      title: "รหัสประกัน",
      dataIndex: "cuscode",
      key: "cuscode",
      width: "20%",
    },
    {
      title: "ชื่อประกัน",
      dataIndex: "cusname",
      key: "cusname",
      width: "30%",
    },
    {
      title: "ราคา",
      dataIndex: "grand_total_price",
      key: "grand_total_price",
      width: "20%",
    },
    {
      title: "วันที่",
      dataIndex: "sodate",
      key: "sodate",
      width: "10%",
    },
  ]
};