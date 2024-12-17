import { Button, Space } from "antd";
import "../../assets/styles/banks.css"
import { Typography, Flex } from "antd";
// import { Popconfirm, Button } from "antd";
import { Tooltip } from "antd";
// import { EditOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons"; 
import { EditableRow, EditableCell } from "../../components/table/TableEditAble";
import { TagInvoiceStatus } from "../../components/badge-and-tag/";
import dayjs from 'dayjs';
import { EditOutlined, PrinterOutlined } from "@ant-design/icons";
import { comma } from '../../utils/util';

/** export component for edit table */
export const componentsEditable = {
  body: { row: EditableRow, cell: EditableCell },
};

/** get sample column */
export const accessColumn = ({ handleEdit, handleDelete, handleView, handlePrint }) => [
  {
    title: "เลขที่ใบวางบิล",
    key: "ivcode",
    dataIndex: "ivcode",
    align: "left",
    width: 140,
  },
  {
    title: "วันที่ใบวางบิล",
    dataIndex: "redate",
    key: "redate",
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
    render: (data) => <TagInvoiceStatus result={data} />,
  },
  {
    title: "จัดทำโดย",
    dataIndex: "created_name",
    key: "created_name",
    width: '15%',
    sorter: (a, b) => (a.created_name).localeCompare(b.created_name),
    ellipsis: {
      showTitle: false,
    },
    render: (v) => <Tooltip placement="topLeft" title={v}>{v}</Tooltip>,
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
          style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => handleEdit(record)}
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
          style={{ cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => handlePrint(record)}
          size="small"
        />
        {/* <ButtonAttachFiles code={record.srcode} refs='Sample Request' showExpire={true} /> */}
      </Space>
    ),
  },
];

export const productColumn = ({ handleRemove, handleSelectChange }) => [
  {
    key: "code",
    dataIndex: "code",
    align: "left",
    hidden: true,
  },
  {
    title: "ลำดับ",
    dataIndex: "ind",
    key: "ind",
    align: "center",
    width: 80,
    render: (im, rc, index) => <>{index + 1}</>,
  },
  {
    title: "เลขที่ใบกำกับ",
    dataIndex: "recode",
    key: "recode",
    width: 150,
    align: "center",
  },
  {
    title: "ลงวันที่",
    key: "redate",
    dataIndex: "redate",
    align: "center",
    width: 120,
    render: (v, rec) => !!rec.redate ? dayjs(v).format("DD/MM/YYYY") : '',
  },
  {
    title: "วันที่ครบกำหนด",
    key: "duedate",
    dataIndex: "duedate",
    align: "center",
    width: 120,
    render: (v, rec) => !!rec.duedate ? dayjs(v).format("DD/MM/YYYY") : '',
  },
  {
    title: "หมายเหตุ",
    dataIndex: "remark",
    key: "remark",
    align: "center",
  },  
  {
    title: "จำนวนเงิน",
    dataIndex: "price",
    key: "price",
    width: "10%",
    align: "right",
    className: "!pe-3"
  },
  {
    title: "ตัวเลือก",
    align: "center",
    key: "operation",
    dataIndex: "operation",
    render: (_, record, idx) => handleRemove(record),
    width: '90px',
    fixed: 'right',
  },
];

export const paymentColumn = ({ handleRemovePayment, handleSelectChange }) => [
  {
    title: "ลำดับ",
    dataIndex: "ind",
    key: "ind",
    align: "center",
    width: 80,
    render: (im, rc, index) => <>{index + 1}</>,
  },
  {
    title: "วันที่รับชำระ",
    dataIndex: "paydate",
    key: "paydate",
    width: 140,
    sorter: (a, b) => (a.paydate).localeCompare(b.paydate),
    render: (v) => dayjs(v).format("DD/MM/YYYY"),
  },
  {
    title: "ช่องทางรับชำระ",
    dataIndex: "payment_type",
    key: "payment_type",
    align: "left",
    width: "15%",
    render: (_, rec) => rec.payment_type,
  },
  {
    title: "เลขที่บัญชี",
    dataIndex: "bank_no",
    key: "bank_no",
    align: "left",
    width: "15%",
    render: (_, rec) => rec.bank_no,
  },

  {
    title: "ธนาคาร",
    key: "bank",
    dataIndex: "bank",
    align: "left",
    width: "25%",
    render: (_, record) => (<>
      {record.bank !== undefined ? <Flex align='center' gap={8}>
        <i className={`bank bank-${record.bank} shadow huge`} style={{ height: 24, width: 24, marginTop: 4 }}></i>
        <Flex align='start' gap={1} vertical>
          <Typography.Text ellipsis style={{ fontSize: 13 }}>{record.bank_name_th}</Typography.Text>
          <Typography.Text ellipsis style={{ fontSize: 9, color: '#8c8386' }}>{record.bank_name}</Typography.Text>
        </Flex>
      </Flex> : <></>}
    </>)
  },

  {
    title: "หมายเหตุ",
    dataIndex: "remark",
    key: "remark",
    align: "left",
  },
  {
    title: "ยอดรับชำระ",
    dataIndex: "price",
    key: "price",
    width: "15%",
    align: "right",
    className: "!pe-3",
    render: (_, rec) => <>{comma(Number(rec?.price || 0), 2, 2)}</>,
  },
  {
    title: "ตัวเลือก",
    align: "center",
    key: "operation",
    dataIndex: "operation",
    render: (_, record, idx) => handleRemovePayment(idx),
    width: '90px',
    fixed: 'right',
  },
];

export const columnsParametersEditable = (handleEditCell, optionsItems, { handleRemove }) => {
  const col = productColumn({ handleRemove });
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

export const columnsPaymentEditable = (handleEditCell, { handleRemovePayment }) => {
  const col = paymentColumn({ handleRemovePayment });
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
        }
      },
    };
  });
}
export const DEFALUT_CHECK_RECEIPT = {
  ivcode: null,
  ivdate: null,
  cuscode: null,
  remark: null,
  branch: null,
  check_no: null,
  check_amount: 0,
  price: 0,
}


