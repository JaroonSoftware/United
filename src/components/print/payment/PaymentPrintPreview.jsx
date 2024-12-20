/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
// import ReactDOMServer from "react-dom/server";
import { useReactToPrint } from "react-to-print";
import "./payment.css";
// import logo from "../../../assets/images/QRCODEDN.jpg";
import { Button, Flex, Table, Typography, message } from "antd";
import { column } from "./payment.model";
import thaiBahtText from "thai-baht-text";
import dayjs from "dayjs";
import { comma } from "../../../utils/util";
import { PiPrinterFill } from "react-icons/pi";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import IVServiece from "../../../service/Invoice.service";

const ivserviece = IVServiece();

function IVPrintPreview() {
  const { code } = useParams();
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    onBeforePrint: () => handleBeforePrint(),
    onAfterPrint: () => handleAfterPrint(),
    removeAfterPrint: true,
  });

  const [paymentdata, setPaymentData] = useState({});
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
      ivserviece
        .get_payment(code)
        .then(async (res) => {
          console.log(res);
          const {
            data: { payment },
          } = res.data;
          setDetails(payment);
          setPaymentData(payment[0]);
          console.log(payment);
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
          <div className="flex ps-3 grow-0" style={{ width: "80%" }}>
            <Flex className="mb-1.5" vertical>
              <Typography.Text
                className="tx-title min-w-80 weight600"
                strong
                style={{ fontSize: 17 }}
              >
                บริษัท ยูไนเต็ด ออโตสแปร์พาร์ท จำกัด
              </Typography.Text>
              <Typography.Text className="tx-info" style={{ fontSize: 12 }}>
                29/14-15 ถ.บรมราชชนนี แขวงศาลาธรรมสพน์ <br></br>เขตทวีวัฒนา
                กรุงเทพฯ
              </Typography.Text>
              <Typography.Text className="tx-info" style={{ fontSize: 12 }}>
                เลขประจำตัวผู้เสียภาษี&nbsp;&nbsp;&nbsp;0105562202122&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;สำนักงานใหญ่
              </Typography.Text>
            </Flex>
          </div>

          <div className="flex ps-3 grow" style={{ float: "right" }}>
            <Flex className="mb-1.5" vertical style={{ paddingLeft: 0 }}>
              <Typography.Text
                className="tx-title min-w-48"
                style={{ textAlign: "right", fontSize: 17 }}
                strong
              >
                ใบสำคัญรับ
              </Typography.Text>
              <Typography.Text style={{ textAlign: "right", paddingTop: 10 }}>
                Page {page}
              </Typography.Text>
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
          <Flex
            className="flex ps-3 grow-0"
            style={{ border: "1px solid", width: "80%" }}
          >
            <Flex vertical>
              <Typography.Text className="tx-info">
                รับเงินจาก
                <span style={{ paddingLeft: 60 }}>{paymentdata?.cuscode}</span>
              </Typography.Text>
              <Typography.Text className="tx-info">
                Received Form
                <span style={{ paddingLeft: 26 }}>
                  {paymentdata?.prename} {paymentdata?.cusname}
                  <br></br>
                </span>
                <span style={{ paddingLeft: 109 }}>
                  {paymentdata?.idno} {paymentdata?.road}{" "}
                  {paymentdata?.subdistrict} {paymentdata?.district}{" "}
                  {paymentdata?.provin} {paymentdata?.zipcode}
                </span>
                <br></br>
                <span style={{ paddingLeft: 109 }}>
                  โทรศัพท์ {paymentdata?.tel}
                </span>
                <br></br>
                <span style={{ paddingLeft: 109 }}>
                  เลขประจำตัวผู้เสียภาษี {paymentdata?.taxnumber}{" "}
                  {paymentdata?.branch} {paymentdata?.branch_details}
                </span>
              </Typography.Text>
            </Flex>
          </Flex>
          <Flex
            vertical
            gap={3}
            style={{
              width: "20%",
              marginLeft: 2,
            }}
          >
            <Flex vertical style={{ border: "1px solid" }}>
              <Typography.Text
                className="tx-info text-center"
                style={{
                  lineHeight: "1em",
                  fontSize: 11,
                  borderBottom: "1px solid",
                  padding: 2,
                }}
              >
                วันที่<br></br>Date
              </Typography.Text>
              <Typography.Text className="tx-info text-center">
                {dayjs(paymentdata?.ivdate).format("DD/MM/YYYY")}
              </Typography.Text>
            </Flex>
            <Flex vertical style={{ border: "1px solid" }}>
              <Typography.Text
                className="tx-info text-center"
                style={{
                  lineHeight: "1em",
                  fontSize: 11,
                  borderBottom: "1px solid",
                  padding: 2,
                }}
              >
                ใบสำคัญรับเลขที่<br></br>Voucher No.
              </Typography.Text>
              <Typography.Text className="tx-info text-center">
                {paymentdata?.ivcode}
              </Typography.Text>
            </Flex>
          </Flex>
        </div>
      </div>
    );
  };

  const ReceiptSummary = (rec) => {
    return (
      <>
        <Table.Summary.Row className="r-sum rl">
          <Table.Summary.Cell colSpan={3} className="text-summary">
            <Typography.Text style={{ fontSize: 13 }}>
              จำนวนเงิน(บาท)
              <br></br>
              {thaiBahtText(paymentdata?.total_price || 0, 2, 2)}
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell
            colSpan={3}
            className="text-summary text-start !align-top"
          >
            <Typography.Text className="text-sm ">
              จำนวนการรับชำระ<br></br>
              เอกสารประกอบใบสำคัญจำนวน
            </Typography.Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell className="text-summary text-end ">
            <Typography.Text
              className="text-sm "
              strong
              style={{ paddingTop: 20 }}
            >
              {comma(Number(paymentdata?.total_price))}
            </Typography.Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>

        <Table.Summary.Row>
          <Table.Summary.Cell
            colSpan={8}
            className="!align-top !ps-0 !pt-2 !pe-0 "
          >
            <Flex className="w-full" gap={8} justify={"center"}>
              <Flex
                vertical
                className="w-1/3"
                style={{
                  borderRight: "1px solid",
                  borderLeft: "1px solid",
                  borderTop: "1px solid",
                  borderBottom: "1px solid",
                }}
              >
                <Flex justify="center" style={{ borderBottom: "1px solid" }}>
                  <Typography.Text className="tx-info text-center" strong>
                    ผู้จัดทำ<br></br>Prepared By
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
                }}
              >
                <Flex justify="center" style={{ borderBottom: "1px solid" }}>
                  <Typography.Text className="tx-info text-center" strong>
                    ผู้ตรวจสอบ<br></br>Checked By
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
                }}
              >
                <Flex justify="center" style={{ borderBottom: "1px solid" }}>
                  <Typography.Text className="tx-info text-center" strong>
                    ผู้อนุมัติ<br></br>Authorized By
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
                }}
              >
                <Flex justify="center" style={{ borderBottom: "1px solid" }}>
                  <Typography.Text className="tx-info text-center" strong>
                    ผู้จ่ายเงิน<br></br>Paid By
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
                }}
              >
                <Flex justify="center">
                  <Typography.Text className="tx-info text-center" strong>
                    ผู้รับเงิน<br></br>Payee
                  </Typography.Text>
                </Flex>
                <Flex
                  justify="center"
                  style={{ borderTop: "1px solid", paddingTop: 80 }}
                >
                  <Typography.Text className="tx-info text-center"></Typography.Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex>
              <Typography.Text className="tx-info text-center">
                หมายเหตุ I = รับชำระเงินจากใบกำกับ B = รับชำระเงินจากใบวางบิล
              </Typography.Text>
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
      <div className="payment-pages flex flex-col">
        <div className="print-content">{children}</div>
      </div>
    );
  };

  return (
    <>
      {/* <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24, }} spin />} fullscreen /> */}
      <div className="page-show" id="payment">
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

export default IVPrintPreview;
