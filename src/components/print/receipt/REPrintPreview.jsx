/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
// import ReactDOMServer from "react-dom/server";
import { useReactToPrint } from "react-to-print";
import "./re.css";
import logo from "../../../assets/images/logo.jpg";
import { Button, Flex, Table, Typography, message } from "antd";
import { column } from "./re.model";
import thaiBahtText from "thai-baht-text";
import dayjs from "dayjs";
import { comma } from "../../../utils/util";
import { PiPrinterFill } from "react-icons/pi";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import REServiece from "../../../service/Receipt.service";

const reserviece = REServiece();

function REPrintPreview() {
  const { code } = useParams();
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    onBeforePrint: () => handleBeforePrint(),
    onAfterPrint: () => handleAfterPrint(),
    removeAfterPrint: true,
  });

  const [hData, setHData] = useState({});
  const [details, setDetails] = useState([]);

  const columnDesc = column;

  const [loading] = useState(false);

  const handleAfterPrint = () => {
    // setNewPageContent([]);
  };
  const handleBeforePrint = (e) => {
    // console.log("before printing...")
  };

  useEffect(() => {
    const init = () => {
      reserviece
        .getprint(code)
        .then(async (res) => {
          const {
            data: { header, detail },
          } = res.data;

          setHData(header);
          setDetails(detail);
        })
        .catch((err) => {
          console.log(err);
          message.error("Error getting infomation Estimation.");
        });
    };

    init();
    return () => {};
  }, []);

  const ContentHead = ({ page }) => {
    return (
      <div className="content-head in-sample flex flex-col">
        <div className="print-title flex">
          <Flex>
            <Flex vertical style={{ width: "50%" }}>
              <Typography.Text
                className="tx-info"
                style={{ fontSize: 10, textAlign: "center", marginLeft: 15 }}
              >
                <img
                  src={logo}
                  alt=""
                  style={{
                    width: 280,
                    height: 100,
                  }}
                />
                เลขประจำตัวผู้เสียภาษีอากร<br></br> 0105562202122
              </Typography.Text>
            </Flex>
            <Flex vertical style={{ width: "100%", marginLeft: 50 }}>
              <Typography.Text
                className="tx-title  text-center"
                strong
                style={{ fontSize: 18, textAlign: "center" }}
              >
                บริษัท ยูไนเต็ด ออโตสแปร์พาร์ท จำกัด
              </Typography.Text>
              <Typography.Text
                style={{ paddingTop: 8, textAlign: "center" }}
                className="tx-info "
              >
                <span
                  strong
                  style={{ 
                    // textDecoration: "underline",
                     fontWeight: "bold" }}
                >
                  สำนักงานใหญ่
                </span>
                <span style={{ fontSize: 11 }}>
                  : 29/14-15 ถ.บรมราชชนนี แขวงศาลาธรรมสพน์ <br></br>เขตทวีวัฒนา
                  กรุงเทพมหานคร 10170
                </span>
              </Typography.Text>
              <Typography.Text
                className="tx-info"
                style={{ paddingTop: 4, fontSize: 12, textAlign: "center" }}
              >
                โทร. 02-408-1708, 02-441-3488 แฟกซ์. 02-441-3488
              </Typography.Text>
              <Typography.Text
                className="tx-title min-w-48"
                strong
                style={{ textAlign: "center", fontSize: 14 }}
              >
                ใบเสร็จรับเงิน / ใบกำกับภาษี
              </Typography.Text>
              <Typography.Text
                className="tx-title min-w-48"
                style={{ textAlign: "center", fontSize: 14 }}
                strong
              >
                RECEIPT / TAX INVOICE
              </Typography.Text>
            </Flex>
            <Flex
              vertical
              style={{ marginLeft: 100, paddingTop: 50, width: "30%" }}
            >
              <Flex>
                <Typography.Text
                  className="tx-info"
                  strong
                  style={{
                    // border: "1px solid",
                    // borderRadius: 11,
                    width: 120,
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  สำเนา<br></br>COPY
                </Typography.Text>
              </Flex>
              <Flex>
                <Typography.Text
                  className="tx-info"
                  style={{ paddingLeft: 10 }}
                >
                  เอกสารออกเป็นชุด
                </Typography.Text>
              </Flex>
            </Flex>
          </Flex>
        </div>
      </div>
    );
  };

  const ContentHead2 = () => {
    return (
      <div className="content-head in-sample flex flex-col">
        <div className="print-title flex pb-2">
          <div
            className="flex ps-3 grow-0"
            style={{ 
              // border: "1px solid", borderRadius: 10, 
              width: "60%" }}
          >
            <Flex vertical>
              <Typography.Text className="tx-info">
                <p style={{ fontSize: 10, lineHeight: "1em", paddingTop: 5 }}>
                  ลูกค้า
                  <span style={{ paddingLeft: 80 }}>
                    {hData?.cuscode} - {hData?.prename} {hData?.cusname}
                  </span>
                  <br></br>Messrs
                </p>
              </Typography.Text>
              <Typography.Text className="tx-info">
                <p style={{ fontSize: 10, lineHeight: "1em" }}>
                  ที่อยู่ <span style={{ paddingLeft: 82 }}>{hData?.address}</span><br></br>Address
                 
                </p>
              </Typography.Text>
              <Typography.Text className="tx-info">
                <p style={{ fontSize: 10, lineHeight: "1em" }}>
                  สถานที่จัดส่ง
                  <span style={{ paddingLeft: 51 }}>
                    {hData?.cuscode} - {hData?.delname}
                  </span>
                  <br></br>Delivery location
                </p>
              </Typography.Text>
              <Typography.Text className="tx-info">
                <p style={{ fontSize: 10, lineHeight: "1em" }}>
                  ที่อยู่จัดส่ง<span style={{ paddingLeft: 62 }}>{hData?.deladdress}</span><br></br>Shipping address
                
                </p>
              </Typography.Text>
              <Typography.Text className="tx-info" style={{ paddingTop: 5 }}>
                <p style={{ fontSize: 10, lineHeight: "1em" }}>
                  เลขที่เคลม
                  <span style={{ paddingLeft: 60 }}>
                    {hData?.claim_no}
                  </span>
                </p>
              </Typography.Text>
            </Flex>
          </div>
          <div
            className="flex ps-3 grow-0"
            style={{
              // border: "1px solid",
              // borderRadius: 10,
              width: "40%",
              marginLeft: 2,
            }}
          >
            <Flex vertical>
              <Typography.Text className="tx-info">
                <p style={{ fontSize: 10, lineHeight: "1em", paddingTop: 4 }}>
                  วันที่
                  <span style={{ paddingLeft: 70 }}>
                    {dayjs(hData?.redate).format("DD/MM/YYYY")}
                  </span>
                  <br></br>Date{" "}
                </p>
              </Typography.Text>
              <Typography.Text className="tx-info">
                <p style={{ fontSize: 10, lineHeight: "1em" }}>
                  เลขที่ใบกำกับ{" "}
                  <span style={{ paddingLeft: 29 }}>
                    {hData?.recode}
                  </span>
                  <br></br>Order No.
                </p>
              </Typography.Text>
              <Typography.Text className="tx-info">
                <p style={{ fontSize: 10, lineHeight: "1em" }}>
                  เลขทะเบียนรถ
                  <span style={{ paddingLeft: 30 }}>
                    {hData?.car_no}
                  </span>
                  <br></br>Car Registration
                </p>
              </Typography.Text>
              <Typography.Text className="tx-info">
                <p style={{ fontSize: 10, lineHeight: "1em" }}>
                  ครบกำหนด
                  <span style={{ paddingLeft: 41 }}>
                    {dayjs(hData?.redate).format("DD/MM/YYYY")}
                  </span>
                  <br></br>Due Date
                </p>
              </Typography.Text>
            </Flex>
          </div>
        </div>
      </div>
    );
  };

  const ReceiptSummary = (rec) => {
    return (
      <>
        <Table.Summary.Row className="r-sum rl">
          <Table.Summary.Cell colSpan={4} className="text-summary">
            <Typography.Text style={{ fontSize: 13 }}>
              {thaiBahtText(hData?.grand_total_price || 0, 2, 2)}
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell
            colSpan={2}
            className="text-summary text-start !align-top"
          >
            <Typography.Text
              className="text-sm text-center"
              style={{
                fontSize: 10,
                display: "block",
                lineHeight: "1.3em",
              }}
            >
              รวมราคาสินค้า<br></br>Sub Total
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell className="text-summary text-end !align-top">
            {comma(Number(hData?.total_price || 0), 2, 2)}
          </Table.Summary.Cell>
        </Table.Summary.Row>

        <Table.Summary.Row className="r-sum rl">
          <Table.Summary.Cell colSpan={4}>
            <Flex>
              <Typography.Text
                className="tx-info text-center"
                style={{ fontSize: 11, paddingLeft: 5 }}
              >
                ชำระโดย :
              </Typography.Text>
              <Typography.Text
                className="tx-info"
                style={{ fontSize: 11, paddingLeft: 5 }}
              >
                <span>(&nbsp;&nbsp;&nbsp;)&nbsp;&nbsp;เงินสด</span>
                <br></br>
                <span>(&nbsp;&nbsp;&nbsp;)&nbsp;&nbsp;เงินโอน</span>
                <br></br>
              </Typography.Text>
            </Flex>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} className="text-summary text-summarybdr">
            <Flex vertical>
              <Typography.Text
                className="text-sm text-center"
                style={{
                  fontSize: 10,
                  display: "block",
                  lineHeight: "1.3em",
                }}
              >
                จำนวนภาษีมูลค่าเพิ่ม<br></br>V.A.T
              </Typography.Text>
            </Flex>
          </Table.Summary.Cell>
          <Table.Summary.Cell className="text-summarybdr text-summarybdb text-end"> {comma(Number((hData?.vat * hData?.total_price) / 100 || 0))}</Table.Summary.Cell>
        </Table.Summary.Row>

        <Table.Summary.Row className="r-sum rl">
          <Table.Summary.Cell colSpan={4}>
            <Typography.Text
              className="tx-info text-center"
              style={{ fontSize: 11 }}
            >
              <span style={{marginLeft: 60}}>
                (&nbsp;&nbsp;&nbsp;)&nbsp;&nbsp;เช็คธนาคาร...................สาขา...............เลขที่..................ลงวันที่......................
              </span>
              <br></br>
              <span style={{marginLeft: 100}}>
                (ใบเสร็จรับเงินฉบับนี้
                จะสมบูรณ์ต่อเมื่อเก็บเงินตามเช็คดังกล่าวได้แล้ว)
              </span>
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell colSpan={2} className="text-summary text-summarybdr ">
            <Flex vertical>
              <Typography.Text
                className="text-sm text-center"
                style={{
                  fontSize: 10,
                  display: "block",
                  lineHeight: "1.3em",
                }}
              >
                จำนวนเงินรวมทั้งสิ้น<br></br>Net Total
              </Typography.Text>
            </Flex>
          </Table.Summary.Cell>
          <Table.Summary.Cell className="text-summarybdr  text-summarybdb text-summaryrdbr text-end"> {comma(Number(hData?.grand_total_price || 0), 2, 2)}</Table.Summary.Cell>
        </Table.Summary.Row>

        <Table.Summary.Row>
          <Table.Summary.Cell
            colSpan={8}
            className="!align-top !ps-0 !pt-2 !pe-0 "
          >
            <Flex className="w-full" gap={8} justify={"center"}>
              <Flex vertical className="w-1/3">
                <Flex justify="center">
                  <Typography.Text className="tx-info text-center" strong>
                    ผู้รับของ/Receiver
                  </Typography.Text>
                </Flex>
                <Flex
                  justify="center"
                  style={{
                    // borderRight: "1px solid",
                    // borderLeft: "1px solid",
                    // borderTop: "1px solid",
                    // borderTopRightRadius: 8,
                    // borderTopLeftRadius: 8,
                    padding: 5,
                  }}
                >
                  <Typography.Text
                    className="tx-info text-center"
                    style={{ fontSize: 10 }}
                  >
                    ได้รับสินค้าตามรายการถูกต้องแล้ว
                  </Typography.Text>
                </Flex>

                <Flex
                  justify="center"
                  style={{
                    // borderRight: "1px solid",
                    // borderLeft: "1px solid",
                    // borderBottom: "1px solid",
                    // borderBottomRightRadius: 8,
                    // borderBottomLeftRadius: 8,
                    paddingTop: 50,
                  }}
                >
                  <Typography.Text className="tx-info text-center">
                    ...............................................<br></br>
                    วันที่/Date................................
                  </Typography.Text>
                </Flex>
              </Flex>
              <Flex vertical className="w-1/3">
                <Flex justify="center">
                  <Typography.Text className="tx-info text-center" strong>
                    ผู้ส่งของ/Delivered By
                  </Typography.Text>
                </Flex>
                <Flex
                  justify="center"
                  style={{
                    // borderRight: "1px solid",
                    // borderLeft: "1px solid",
                    // borderTop: "1px solid",
                    // borderTopRightRadius: 8,
                    // borderTopLeftRadius: 8,
                    padding: 5,
                  }}
                >
                  <Typography.Text
                    className="tx-info text-center"
                    style={{ fontSize: 10 }}
                  ></Typography.Text>
                </Flex>
                <Flex
                  justify="center"
                  style={{
                    // borderRight: "1px solid",
                    // borderLeft: "1px solid",
                    // borderBottom: "1px solid",
                    // borderBottomRightRadius: 8,
                    // borderBottomLeftRadius: 8,
                    paddingTop: 67,
                  }}
                >
                  <Typography.Text className="tx-info text-center">
                    ...............................................<br></br>
                    วันที่/Date................................
                  </Typography.Text>
                </Flex>
              </Flex>
              <Flex vertical className="w-1/3">
                <Flex justify="center">
                  <Typography.Text className="tx-info text-center" strong>
                    ผู้รับเงิน/Collector
                  </Typography.Text>
                </Flex>
                <Flex
                  justify="center"
                  style={{
                    // borderRight: "1px solid",
                    // borderLeft: "1px solid",
                    // borderTop: "1px solid",
                    // borderTopRightRadius: 8,
                    // borderTopLeftRadius: 8,
                    padding: 5,
                  }}
                >
                  <Typography.Text
                    className="tx-info text-center"
                    style={{ fontSize: 10 }}
                  ></Typography.Text>
                </Flex>
                <Flex
                  justify="center"
                  style={{
                    // borderRight: "1px solid",
                    // borderLeft: "1px solid",
                    // borderBottom: "1px solid",
                    // borderBottomRightRadius: 8,
                    // borderBottomLeftRadius: 8,
                    paddingTop: 67,
                  }}
                >
                  <Typography.Text className="tx-info text-center">
                    ...............................................<br></br>
                    วันที่/Date................................
                  </Typography.Text>
                </Flex>
              </Flex>
              <Flex vertical className="w-1/3">
                <Flex justify="center">
                  <Typography.Text
                    className="tx-info text-center"
                    strong
                    style={{ fontSize: 8, paddingTop: 6 }}
                  >
                    ผู้ได้รับมอบอำนาจ/Authorized Signature
                  </Typography.Text>
                </Flex>
                <Flex
                  justify="center"
                  style={{
                    // borderRight: "1px solid",
                    // borderLeft: "1px solid",
                    // borderTop: "1px solid",
                    // borderTopRightRadius: 8,
                    // borderTopLeftRadius: 8,
                    padding: 5,
                  }}
                >
                  <Typography.Text
                    className="tx-info text-center"
                    style={{ fontSize: 8 }}
                  >
                    ในนาม บริษัท ยูไนเต็ด ออโตสแปร์พาร์ท จำกัด<br></br>
                    For UNITED AUTOSPAREPART CO.,LTD
                  </Typography.Text>
                </Flex>

                <Flex
                  justify="center"
                  style={{
                    // borderRight: "1px solid",
                    // borderLeft: "1px solid",
                    // borderBottom: "1px solid",
                    // borderBottomRightRadius: 8,
                    // borderBottomLeftRadius: 8,
                    paddingTop: 43,
                  }}
                >
                  <Typography.Text className="tx-info text-center">
                    ...............................................<br></br>
                    วันที่/Date................................
                  </Typography.Text>
                </Flex>
              </Flex>
            </Flex>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    );
  };

  const ContentBody = () => {
    return (
      <div>
        <Table
          size="small"
          dataSource={details}
          columns={columnDesc}
          pagination={false}
          rowKey="stcode"
          bordered={false}
          locale={{
            emptyText: <span>No data available, please add some data.</span>,
          }}
          onRow={(record, index) => {
            return { className: "r-sub" };
          }}
          summary={ReceiptSummary}
        />
      </div>
    );
  };

  const Pages = ({ pageNum = 1, total = 1 }) => (
    <div ref={componentRef}>
      <ContentData>
        <ContentHead page={`${pageNum} of ${total}`} />
        <ContentHead2 />
        <ContentBody />
      </ContentData>
    </div>
  );

  const ContentData = ({ children, pageNum = 1, total = 1 }) => {
    return (
      <div className="re-pages flex flex-col">
        <div className="print-content">{children}</div>
      </div>
    );
  };

  return (
    <>
      {/* <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24, }} spin />} fullscreen /> */}
      <div className="page-show" id="quo">
        {loading && <Spin fullscreen indicator={<LoadingOutlined />} />}
        <div className="title-preview">
          <Button
            className="bn-center  bg-blue-400"
            // onClick={() => { handleCheckMultiPages() }}
            onClick={() => {
              handlePrint(null, () => componentRef.current);
            }}
            icon={<PiPrinterFill style={{ fontSize: "1.1rem" }} />}
          >
            PRINT
          </Button>
        </div>
        <div className="layout-preview">
          <Pages />
        </div>
        {/* <div className='hidden'>
                    <div ref={printRef}>
                        {newPageContent?.map( (page, i) => ( 
                        <div key={i}>
                            <ContentData pageNum={i+1} total={(newPageContent.length)} > 
                                {page?.map( (eml, ind) => (<div key={ind} dangerouslySetInnerHTML={{ __html: eml.outerHTML }} ></div>) )}
                            </ContentData>
                            {i < (newPageContent.length-1) && <div className='page-break'></div>}
                        </div> 
                        ))}
                    </div>
                </div> */}
      </div>
    </>
  );
}

export default REPrintPreview;
