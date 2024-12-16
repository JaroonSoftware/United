/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
// import ReactDOMServer from "react-dom/server";
import { useReactToPrint } from "react-to-print";
import "./dn.css";
import logo from "../../../assets/images/QRCODEDN.jpg";
import { Button, Flex, Table, Typography, message } from "antd";
import { column } from "./dn.model";

import dayjs from "dayjs";
// import { comma } from "../../../utils/util";
import { PiPrinterFill } from "react-icons/pi";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import DNService from "../../../service/DeliveryNote.service";

const dnservice = DNService();

function DNPrintPreview() {
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
       dnservice
         .get(code)
         .then(async (res) => {
           const { header, detail } = res.data;
 
           setHData(header);
           setDetails(detail);
         })
         .catch((err) => {
           console.log(err);
           message.error("Error getting Quotation.");
         });
     };
 
     init();
     return () => {};
   }, []);
 

  const ContentHead = ({ page }) => {
    return (
      <div className="content-head in-sample flex flex-col">
        <div className="print-title flex pb-2">
          <div className="flex ps-3 grow-0">
            <Flex className="mb-1.5" vertical>
              <Typography.Text className="tx-title min-w-80 weight600" strong>
                บริษัท ยูไนเต็ด ออโตสแปร์พาร์ท จำกัด
              </Typography.Text>
              <Typography.Text style={{ paddingTop: 8 }} className="tx-info">
                29/14-15 ถ.บรมราชชนนี แขวงศาลาธรรมสพน์ เขตทวีวัฒนา
              </Typography.Text>
              <Typography.Text className="tx-info">
                กรุงเทพมหานคร 10170
              </Typography.Text>
              <Typography.Text
                className="tx-info"
                style={{ paddingTop: 2, fontSize: 13 }}
              >
                โทรศัพท์ 094-923-7111 แฟกซ์
              </Typography.Text>
              <Typography.Text className="tx-info" style={{ fontSize: 13 }}>
                เลขประจำตัวผู้เสียภาษี 0105562202122
              </Typography.Text>
            </Flex>
          </div>
          <div className="flex" style={{ border: "1px solid" ,height: "80%"}}>
            <Flex>
              <Typography.Text style={{width: 100}}>
                <div >
                  <img
                    src={logo}
                    alt=""
                    style={{
                      width: "100%",
                      padding: 5,
                      paddingTop: 5
                    }}
                  />
                 
                </div>
              </Typography.Text>
              <Typography.Text  style={{width: 120 ,paddingTop: 11,paddingRight: 5, textAlign: "center"}}>
              <span style={{ fontSize: 8}}>UNITED AUTOSPAREPART</span> <br></br>
               <span style={{ fontSize: 15 }}>LINE OFFICIAL</span> <br></br>
               <span style={{ fontSize: 11 }}>สอบถามข้อมูล/ส่งบิล</span> 
              </Typography.Text>
              
            </Flex>
          </div>
          <div className="flex ps-3 grow">
            <Flex className="mb-1.5" vertical style={{ paddingLeft: 0 }}>
              <Typography.Text style={{ textAlign: "right" }}>
                หน้า {page}
              </Typography.Text>
              <Typography.Text
                className="tx-title min-w-48"
                strong
                style={{ textAlign: "center", fontSize: 18 }}
              >
                ใบส่งสินค้า
              </Typography.Text>
              <Typography.Text
                className="tx-title min-w-48"
                style={{ textAlign: "center", fontSize: 18 }}
                strong
              >
                Delivery Note
              </Typography.Text>
              <Flex justify="space-between min-w-70">
                <Typography.Text className="tx-info" strong>
                  เลขที่ใบส่งสินค้า
                </Typography.Text>
                <Typography.Text className="tx-info" strong>
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
            style={{ border: "1px solid", borderRadius: 10, width: "75%" }}
          >
            <Flex vertical>
              <Typography.Text className="tx-info" style={{ width: "100%" }}>
               ลูกค้า :
              </Typography.Text>
              <Typography.Text className="tx-info" style={{ height: 35 }}>
                ที่อยู่ลูกค้า :
              </Typography.Text>
              <Typography.Text className="tx-info">สถานที่จัดส่ง :</Typography.Text>
              <Typography.Text className="tx-info" style={{ height: 35 }}>
               ที่อยู่จัดส่ง :
              </Typography.Text>
            </Flex>
            <Flex vertical style={{ width: "80%", paddingLeft: 3 }}>
              <Typography.Text className="tx-info">
                {hData?.cuscode} - {hData?.prename} {hData?.cusname}
              </Typography.Text>
              <Typography.Text className="tx-info">
              
              </Typography.Text>
              <Typography.Text className="tx-info" style={{ height: 35 }}>
                {hData?.address}
              </Typography.Text>
              <Typography.Text className="tx-info">
              {hData?.delcode} - {hData?.delname}
              </Typography.Text>
              <Typography.Text className="tx-info" style={{ height: 35 }}>
                {hData?.deladdress} โทร.{hData?.deltel}
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
                <span style={{ paddingLeft: 1 }}>{hData?.claim_no}</span>
              </Typography.Text>
              <Typography.Text className="tx-info">
                เลขที่รับแจ้ง :{" "}
                <span style={{ paddingLeft: 1 }}>{hData?.require_no}</span>
              </Typography.Text>
              <Typography.Text className="tx-info">
                ทะเบียน :{" "}
                <span style={{ paddingLeft: 1 }}>{hData?.car_no}</span>
              </Typography.Text>
              <Typography.Text className="tx-info">
                เลขตัวถัง :{" "}
                <span style={{ paddingLeft: 1 }}>{hData?.car_engineno}</span>
              </Typography.Text>
              <Typography.Text className="tx-info">
              ข้อมูลรถ :{" "}
                <span style={{ paddingLeft: 1 }}>
                  {hData?.car_model_name} {hData?.brand_name}{" "}
                  {hData?.model_name} {hData?.year}
                </span>
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
                style={{ fontSize: 8, paddingLeft: 5, paddingTop: 10 }}
              >
                * กรุณาตรวจเช็คสินค้าว่าไม่พบ ชำรุด แตก หัก เสียหาย
                ก่อนเซ็นรับสินค้าจากพนักงานขนส่งทุกครั้งหากพบสินค้าชำรุดเสียหายให้รีบแจ้งพนักงานขนส่งทันทีหรือแจ้งกลับทางบริษัท
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
                            <Flex gap={2} style={{ paddingTop: 80 }}>
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

export default DNPrintPreview;
