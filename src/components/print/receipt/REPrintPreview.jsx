/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
// import ReactDOMServer from "react-dom/server";
import { useReactToPrint } from "react-to-print";
import "./re.css";
import logo from "../../../assets/images/logo.jpg";
import { Button, Flex, Table, Typography, message } from "antd";
import { column } from "./re.model";

import dayjs from "dayjs";
// import { comma } from "../../../utils/util";
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
        .get(code)
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
        <div className="print-title flex pb-2">
          
          <div className="flex">
            <Flex vertical>
              <Typography.Text>
                <div >
                  <img
                    src={logo}
                    alt=""
                    style={{
                      width: "50%",
                   marginLeft: 80
                    }}
                  />
                </div>
              </Typography.Text>
              <Typography.Text className="tx-info" style={{ fontSize: 13, textAlign: "center" }}>
                เลขประจำตัวผู้เสียภาษีอากร<br></br> 0105562202122
              </Typography.Text>
            </Flex>
          </div>
          <div className="flex ps-3 grow-0" style={{ marginLeft: 90}}>
            <Flex className="mb-1.5" vertical>
              <Typography.Text className="tx-title min-w-80  text-center" strong style={{ fontSize: 15, textAlign: "center"}}>
             บริษัท ยูไนเต็ด ออโตสแปร์พาร์ท จำกัด
              </Typography.Text>
              <Typography.Text style={{ paddingTop: 8,textAlign: "center" }} className="tx-info">
              <span strong>สำนักงานใหญ๋ </span> : 29/14-15 ถ.บรมราชชนนี แขวงศาลาธรรมสพน์ เขตทวีวัฒนา    กรุงเทพมหานคร 10170
              </Typography.Text>
              <Typography.Text
                className="tx-info"
                style={{ paddingTop: 4, fontSize: 13 ,textAlign: "center" }}
              >
                โทรศัพท์ 094-923-7111 แฟกซ์. 02-441-3488
              </Typography.Text>
              <Typography.Text
                className="tx-title min-w-48"
                strong
                style={{ textAlign: "center", fontSize: 13 }}
              >
                ใบเสร็จรับเงิน / ใบกำกับภาษี
              </Typography.Text>
              <Typography.Text
                className="tx-title min-w-48"
                style={{ textAlign: "center", fontSize: 13 }}
                strong
              >
           RECEIPT / TAX INVOICE
              </Typography.Text>
            </Flex>
          </div>
          <div className="flex ps-3 grow">
            <Flex className="mb-1.5" vertical >
              <Typography.Text style={{ textAlign: "right" }}>
                หน้า {page}
              </Typography.Text>
              
              <Flex justify="space-between min-w-70">
                <Typography.Text className="tx-info" strong>
                  เลขที่ใบส่งสินค้า
                </Typography.Text>
                <Typography.Text className="tx-info">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{hData?.dncode}
                </Typography.Text>
              </Flex>
              {/* <Flex justify="space-between">
                <Typography.Text
                  className="tx-info"
                  style={{ paddingLeft: 90 }}
                  strong
                >
                  วันที่
                </Typography.Text>
                <Typography.Text className="tx-info">
                  {dayjs(hData?.sodate).format("DD/MM/YYYY")}
                </Typography.Text>
              </Flex> */}
            </Flex>
          </div>
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
            style={{ border: "1px solid", borderRadius: 10, width: "60%" }}
          >
            <Flex vertical>
              <Typography.Text className="tx-info">
                นามลูกค้า :
                <span style={{ paddingLeft: 18 }}>
                  {hData?.prename} {hData?.cusname}
                </span>
              </Typography.Text>
              <Typography.Text className="tx-info">
                ที่อยู่ลูกค้า :{" "}
                <span style={{ paddingLeft: 42 }}>
                  {hData?.address} {hData?.zipcode}
                </span>
              </Typography.Text>
              <Typography.Text className="tx-info">
                สถานที่จัดส่ง :{" "}
                <span style={{ paddingLeft: 42 }}>
                  {hData?.address} {hData?.zipcode}
                </span>
              </Typography.Text>
              <Typography.Text className="tx-info">
                ที่อยู่จัดส่ง:{" "}
                <span style={{ paddingLeft: 16 }}>{hData?.remark}</span>
              </Typography.Text>
            </Flex>
          </div>
          <div
            className="flex ps-3 grow-0"
            style={{
              border: "1px solid",
              borderRadius: 10,
              width: "40%",
              marginLeft: 2,
            }}
          >
            <Flex vertical>
              <Typography.Text className="tx-info">
                เลขเคลม :{" "}
                <span style={{ paddingLeft: 21 }}>{hData?.claim_no}</span>
              </Typography.Text>
              <Typography.Text className="tx-info">
                เลขที่รับแจ้ง :{" "}
                <span style={{ paddingLeft: 6 }}>{hData?.require_no}</span>
              </Typography.Text>
              <Typography.Text className="tx-info">
                ทะเบียน :{" "}
                <span style={{ paddingLeft: 26 }}>{hData?.car_no}</span>
              </Typography.Text>
              <Typography.Text className="tx-info">
                เลขตัวถัง :{" "}
                <span style={{ paddingLeft: 20 }}>{hData?.car_engineno}</span>
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
        <Table.Summary.Row>
          <Table.Summary.Cell colSpan={3} className="!align-top !ps-0 !pt-3  ">
            <Flex vertical style={{ border: "1px solid", padding: 3 }}>
              <Typography.Text
                className="tx-info"
                style={{ fontSize: 11, paddingLeft: 5 }}
              >
                หมายเหตุการรับสินค้า
              </Typography.Text>
              <Typography.Text
                className="tx-info "
                style={{ fontSize: 8, paddingLeft: 5, paddingTop: 6 }}
              >
                * กรุณาตรวจเช็คสินค้าว่าไม่พบ ชำรุด แตก หัก เสียหาย
                ก่อนเซ็นรับสินค้าจากพนักงานขนส่งทุกครั้งหากพบ<br></br>
                &nbsp;
                &nbsp;สินค้าชำรุดเสียหายให้รีบแจ้งพนักงานขนส่งทันทีหรือแจ้งกลับทางบริษัท
                ภายใน 3 วัน หลังจากได้รับสินค้า
              </Typography.Text>
            </Flex>
          </Table.Summary.Cell>
          <Table.Summary.Cell
            colSpan={2}
            className="!align-top !ps-0 !pt-3  !pe-0"
          >
            <Flex style={{ border: "1px solid", padding: 3 }}>
              <Typography.Text
                className="tx-info"
                style={{ fontSize: 11, paddingLeft: 5 }}
              >
                ขนส่งโดย
              </Typography.Text>
              <Typography.Text
                className="tx-info"
                style={{ fontSize: 11, paddingLeft: 25 }}
              >
                รถสาย______________________________________<br></br>
                เลขที่_______________________________________<br></br>
                วันที่________________________________________
              </Typography.Text>
            </Flex>
          </Table.Summary.Cell>
        </Table.Summary.Row>
        <Table.Summary.Row>
          <Table.Summary.Cell
            colSpan={8}
            className="!align-top !ps-0 !pt-2 !pe-0 "
          >
            <Flex className="w-full" gap={8} justify={"center"}>
              <Flex vertical className="w-1/3" style={{ gap: 5 }}>
                <Flex vertical gap={2} style={{ paddingTop: 20 }}>
                  <Typography.Text style={{ fontSize: 15 }}>
                    พนักงานขาย
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: 10 }}>
                    ชื่อพนักงานขาย
                    <br></br>
                    {dayjs().format("DD/MM/YYYY HH:mm:ss")}
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: 10 }}>
                    วันที่พิมพ์เอกสาร {dayjs().format("DD/MM/YYYY HH:mm:ss")}
                  </Typography.Text>
                </Flex>
              </Flex>
              <Flex
                vertical
                className="w-1/3"
                style={{
                  borderRight: "1px solid",
                  borderLeft: "1px solid",
                  borderTop: "1px solid",
                  borderBottom: "1px solid",
                  borderTopRightRadius: 8,
                  borderTopLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  borderBottomLeftRadius: 8,
                }}
              >
                <Flex justify="center">
                  <Typography.Text className="tx-info text-center">
                    ผู้รับสินค้า
                  </Typography.Text>
                </Flex>
                <Flex
                  justify="center"
                  style={{ borderTop: "1px solid", paddingTop: 50 }}
                >
                  <Typography.Text className="tx-info text-center">
                    วันที่.........../.........../...........
                  </Typography.Text>
                </Flex>
              </Flex>
              <Flex
                vertical
                className="w-1/3"
                style={{
                  borderRight: "1px solid",
                  borderLeft: "1px solid",
                  borderTop: "1px solid",
                  borderBottom: "1px solid",
                  borderTopRightRadius: 8,
                  borderTopLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  borderBottomLeftRadius: 8,
                }}
              >
                <Flex justify="center">
                  <Typography.Text className="tx-info text-center">
                    ผู้ส่งสินค้า
                  </Typography.Text>
                </Flex>
                <Flex
                  justify="center"
                  style={{ borderTop: "1px solid", paddingTop: 50 }}
                >
                  <Typography.Text className="tx-info text-center">
                    วันที่.........../.........../...........
                  </Typography.Text>
                </Flex>
              </Flex>
              <Flex
                vertical
                className="w-1/3"
                style={{
                  borderRight: "1px solid",
                  borderLeft: "1px solid",
                  borderTop: "1px solid",
                  borderBottom: "1px solid",
                  borderTopRightRadius: 8,
                  borderTopLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  borderBottomLeftRadius: 8,
                }}
              >
                <Flex gap={2} justify="center" style={{}}>
                  <Typography.Text className="tx-info text-center">
                    ผู้ตรวจสอบ
                  </Typography.Text>
                </Flex>
                <Flex
                  justify="center"
                  style={{ borderTop: "1px solid", paddingTop: 50 }}
                >
                  <Typography.Text className="tx-info text-center">
                    วันที่.........../.........../...........
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
      <div className="dn-pages flex flex-col">
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
