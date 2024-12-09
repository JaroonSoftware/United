import { Button, Space } from "antd"; 
import "../../assets/styles/banks.css"
import { Tooltip,Image } from "antd";
import { EditableRow, EditableCell } from "../../components/table/TableEditAble";
import { TagDeliveryNoteStatus } from "../../components/badge-and-tag/";
import dayjs from 'dayjs';
import {  EditOutlined, PrinterOutlined } from "@ant-design/icons";
import { comma,BACKEND_URL_MAIN } from '../../utils/util';

/** export component for edit table */
export const componentsEditable = {
  body: { row: EditableRow, cell: EditableCell },
};

const calTotalDiscount = (rec) => {
  const total =  Number(rec?.qty ||  0) * Number(rec?.price ||  0);
  const discount = 1 - ( Number(rec?.discount ||  0) / 100 );

  return total * discount;
}

/** get sample column */
export const accessColumn = ({handleEdit, handleDelete, handleView, handlePrintsData}) => [
  {
    title: "เลขที่ใบส่งของ",
    key: "dncode",
    dataIndex: "dncode",
    align: "left",
    sorter: (a, b) => (a.dncode).localeCompare(b.dncode),
    width:140,
  },
  {
    title: "วันที่ใบส่งของ",
    dataIndex: "dndate",
    key: "dndate",
    width: 140,
    sorter: (a, b) => (a.qtdate).localeCompare(b.qtdate),
    render: (v) => dayjs(v).format("DD/MM/YYYY"),
  },
  {
    title: "รหัสลูกค้า",
    dataIndex: "cuscode",
    key: "cuscode",
    width: 120,
    sorter: (a, b) => (a.cuscode).localeCompare(b.cuscode),
  },
  {
    title: "ชื่อลูกค้า",
    dataIndex: "cusname",
    key: "cusname", 
    sorter: (a, b) => (a.cusname).localeCompare(b.cusname),
    ellipsis: {
      showTitle: false,
    },
    render: (v) => <Tooltip placement="topLeft" title={v}>{v}</Tooltip>, 
  },
  {
    title: "สถานะ",
    dataIndex: "doc_status",
    key: "doc_status", 
    width: '13%',
    sorter: (a, b) => a.doc_status.localeCompare(b.doc_status),
    sortDirections: ["descend", "ascend"],
    render: (data) => <TagDeliveryNoteStatus result={data} />,
  },
  {
    title: "Action",
    key: "operation", 
    fixed: 'right',
    width: 100,
    render: (text, record) => (
      <Space >
        <Button
          icon={<EditOutlined />} 
          className='bn-primary-outline'
          style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          onClick={(e) => handleEdit(record) }
          size="small"
        />

        {/* <Popconfirm 
          placement="topRight"
          title="Sure to delete?"  
          description="Are you sure to delete this packaging?"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => handleDelete(record)}
        >
          <Button
            icon={<DeleteOutlined />}
            danger
            style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
            size="small"
          />
        </Popconfirm> */}  
        <Button
          icon={<PrinterOutlined />} 
          className='bn-warning-outline'
          style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          onClick={(e) => handlePrintsData(record.dncode) }
          size="small"
        />  
        {/* <ButtonAttachFiles code={record.srcode} refs='Sample Request' showExpire={true} /> */}
      </Space>
    ),
  }, 
];

export const productColumn = ({handleRemove},optionsItems) => [
  {
    title: "ลำดับ",
    dataIndex: "ind",
    key: "ind",
    align: "center",
    width: 60, 
    render: (im, rc, index) => <>{index + 1}</>,
  },
  {
    title: "รูปประกอบ",
    dataIndex: "file",
    key: "file",
    width: 120,
    align: "center",
    render: (im, rec) => 
      {
        const img = (!!rec.file_name ? `/uploads/` + rec.file_name : `/logo.png`
        );
        return <>
        <Image
      style={{ borderRadius: 10 }}
      preview={false}
      height={75}
      alt={`Image ${rec.file_name}`}
      src={`${BACKEND_URL_MAIN}` + img}
    />
    </>
    },
  },
  {
    title: "รหัสสินค้า",
    dataIndex: "stcode",
    key: "stcode",
    width: 140, 
    align: "center",
  },
  {
    title: "ชื่อสินค้า",
    dataIndex: "stname",
    key: "stname", 
    align: "left", 
    render: (_, rec) => rec.stname,
  },
  {
    title: "ชนิดสินค้า",
    dataIndex: "kind_name",
    key: "kind_name", 
    align: "center", 
    width: "6%",
    render: (_, rec) => rec.kind_name,
  },  
  {
    title: "ใบขายสินค้า",
    dataIndex: "socode",
    key: "socode",
    width: "8%",
    align: "right",
    className: "!pe-3",
  },
  {
    title: "จำนวน",
    dataIndex: "qty",
    key: "qty", 
    width: "8%",
    align: "right",
    className: "!pe-3",
    editable: true,
    required: true,
    type:'number',
    render: (_, rec) => <>{ comma( Number(rec?.qty ||  0),  2, 2 )}</>,
  },
  {
    title: "ราคาขาย",
    dataIndex: "price",
    key: "price", 
    width: "8%",
    align: "right",
    className: "!pe-3",
    editable: true,
    required: true,
    type:'number',
    render: (_, rec) => <>{ comma( Number(rec?.price ||  0),  2, 2 )}</>,
  },
  {
    title: "ต้นทุน",
    dataIndex: "cost",
    key: "cost", 
    width: "8%",
    align: "right",
    className: "!pe-3",        
    // hidden: true,
  },
  {
    title: "หน่วยสินค้า",
    dataIndex: "unit",
    key: "unit", 
      align: "right", 
      width: "8%",
      editable: true,
      type:'select',    
      optionsItems,
      render: (v) => {
        return optionsItems?.find( f  => f.value === v )?.label
      },
  },
  {
    title: "ส่วนลด(%)",
    dataIndex: "discount",
    key: "discount",
    width: "7%",
    align: "right",
    className: "!pe-3",
    editable: true,
    type:'number',
    render: (_, rec) => <>{ comma( Number(rec?.discount ||  0),  2, 2 )}</>,
  },
  {
    title: "ราคารวม",
    dataIndex: "total",
    key: "total",
    width: "10%",
    align: "right",
    className: "!pe-3",
    render: (_, rec) => <>{ comma( calTotalDiscount(rec),  2, 2 )}</>,
  },  
  {
    title: "ตัวเลือก",
    align: "center",
    key: "operation",
    dataIndex: "operation",
    render: (_, record, idx) => handleRemove(record),
    width: '80px',
    fixed: 'right',
  },
];

export const columnsParametersEditable = (handleEditCell,optionsItems,{handleRemove} ) =>{
  const col = productColumn({handleRemove},optionsItems);
  return col.map((col, ind) => {
      if (!col.editable) return col; 
      
      return {
          ...col,
          onCell: (record) => {
            // console.log(record);
            return {
              record,
              editable: col.editable,
              dataIndex: col.dataIndex,
              title: col.title,
              // required: !!col?.required,
              type: col?.type || "input",
              handleEditCell,
              optionsItems,
            }
          },
      };
  }); 
}
export const DEFALUT_CHECK_DELIVERY = {
  dncode: null,
  dndate: null,
  qtcode: null,  
  payment: null,
  cuscode: null,
  remark: null,
  total_weight: 0,
}


