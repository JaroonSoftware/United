/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
// import ReactDOMServer from "react-dom/server";
import { useReactToPrint } from "react-to-print";
import "./so.css";
// import logo from "../../../assets/images/logo_nsf.png";
import thaiBahtText from "thai-baht-text";
import { Button, Flex, Table, Typography, message } from "antd";
import { column } from "./so.model";

import dayjs from "dayjs";
import { comma } from "../../../utils/util";
import { PiPrinterFill } from "react-icons/pi";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import SOService from "../../../service/SO.service";

const soservice = SOService();

function SOPrintPreview() {
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
      soservice
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
          <div className="flex ps-3 grow-0">
            <Flex className="mb-1.5" vertical>
              <Typography.Text className="tx-title min-w-70 weight600" strong>
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
                style={{ paddingTop: 4, fontSize: 13 }}
              >
                โทรศัพท์ 094-923-7111 แฟกซ์
              </Typography.Text>
              <Typography.Text className="tx-info" style={{ fontSize: 13 }}>
                เลขประจำตัวผู้เสียภาษี 0105562202122
              </Typography.Text>
            </Flex>
          </div>
          <div className="flex ps-3 grow">
            <Flex className="mb-1.5" vertical style={{ paddingLeft: 205 }}>
              <Typography.Text style={{ textAlign: "right" }}>
                หน้า {page}
              </Typography.Text>
              <Typography.Text
                className="tx-title min-w-48"
                strong
                style={{ textAlign: "center", fontSize: 18 }}
              >
                ใบสั่งขายสินค้า
              </Typography.Text>
              <Typography.Text
                className="tx-title min-w-48"
                style={{ textAlign: "center", fontSize: 18 }}
                strong
              >
                Sale Order{" "}
              </Typography.Text>
              <Flex justify="space-between min-w-70">
                <Typography.Text className="tx-info" strong>
                  เลขที่ใบสั่งขายสินค้า
                </Typography.Text>
                <Typography.Text className="tx-info">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{hData?.socode}
                </Typography.Text>
              </Flex>
              <Flex justify="space-between">
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
              </Flex>
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
                รหัสลูกค้า :
              </Typography.Text>
              <Typography.Text className="tx-info">นามลูกค้า :</Typography.Text>
              <Typography.Text className="tx-info" style={{ height: 35 }}>
                ที่อยู่ :
              </Typography.Text>
              <Typography.Text className="tx-info">หมายเหตุ :</Typography.Text>
            </Flex>
            <Flex vertical style={{ width: "80%", paddingLeft: 3 }}>
              <Typography.Text className="tx-info">
                {hData?.cuscode}
              </Typography.Text>
              <Typography.Text className="tx-info">
                {hData?.prename} {hData?.cusname}
              </Typography.Text>
              <Typography.Text className="tx-info" style={{ height: 35 }}>
                {hData?.address}
              </Typography.Text>
              <Typography.Text className="tx-info">
                {hData?.remark}
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
          <Table.Summary.Cell colSpan={4} className="!align-top !ps-0 !pt-3  ">
            <Flex style={{ border: "1px solid", padding: 3 }}>
              <Typography.Text
                className="tx-info text-center"
                style={{ fontSize: 11, paddingLeft: 5 }}
              >
                บาท : {thaiBahtText(hData?.grand_total_price || 0, 2, 2)}
              </Typography.Text>
            </Flex>
            <Flex
              style={{
                border: "1px solid",
                padding: 3,
                marginTop: 8,
                height: 46,
                paddingLeft: 8,
              }}
            >
              <Typography.Text
                className="tx-info text-center"
                strong
                style={{ fontSize: 11 }}
              >
                หมายเหตุ : {hData?.remark}
              </Typography.Text>
            </Flex>
          </Table.Summary.Cell>
          <Table.Summary.Cell
            colSpan={1}
            className="!align-top !ps-0 !pt-3 !pe-0 "
          >
            <Flex
              style={{
                borderTop: "1px solid",
                borderLeft: "1px solid",
                borderBottom: "1px solid",
                padding: 3,
                paddingLeft: 10,
              }}
            >
              <Typography.Text className="tx-info">
                <span>รวมเป็นเงิน</span>
                <br></br>
                <span>ภาษีมูลค่าเพิ่ม</span>
              </Typography.Text>
            </Flex>
            <Flex
              style={{
                borderTop: "1px solid",
                borderLeft: "1px solid",
                borderBottom: "1px solid",
                padding: 3,
                marginTop: 8,
                paddingLeft: 10,
              }}
            >
              <Typography.Text className="tx-info" strong>
                ยอดเงินสุทธิ
              </Typography.Text>
            </Flex>
          </Table.Summary.Cell>
          <Table.Summary.Cell
            colSpan={2}
            className="!align-top !ps-0 !pt-3 !pe-0 "
          >
            <Flex
              style={{
                borderTop: "1px solid",
                borderRight: "1px solid",
                borderBottom: "1px solid",
                padding: 3,
                textAlign: "right",
              }}
            >
              <Typography.Text className="tx-info" style={{ width: "100%" }}>
                {comma(Number(hData?.total_price || 0), 2, 2)}
                <br></br>{" "}
                {comma(Number((hData?.vat * hData?.total_price) / 100 || 0))}
              </Typography.Text>
            </Flex>
            <Flex
              style={{
                borderTop: "1px solid",
                borderRight: "1px solid",
                borderBottom: "1px solid",
                padding: 3,
                marginTop: 8,
                textAlign: "right"
              }}
            >
              <Typography.Text className="tx-info" strong style={{  width: "100%"}}>
                {comma(Number(hData?.grand_total_price || 0), 2, 2)}
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
                    ผู้ขายสินค้า
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
                    ผู้อนุมัติขายสินค้า
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
                    เจ้าหน้าที่บัญชี
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
      <div className="so-pages flex flex-col">
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

export default SOPrintPreview;
