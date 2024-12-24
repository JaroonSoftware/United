/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Table,
  Typography,
  message,
  Modal,
} from "antd";
import {
  Card,
  Col,
  Divider,
  Flex,
  Row,
  Space,
  InputNumber,
  Popconfirm,
} from "antd";
import OptionService from "../../service/Options.service";
import ReceiptService from "../../service/Receipt.service";
import DeliveryNoteService from "../../service/DeliveryNote.service";
// import QuotationService from "../../service/Quotation.service";
import {
  SearchOutlined,
  SaveFilled,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import ModalCustomersInsurance from "../../components/modal/customersInsurance/ModalCustomersInsurance";
// import ModalQuotation from "../../components/modal/quotation/MyModal";
import { ModalDN } from "../../components/modal/delivery/index";

import {
  DEFALUT_CHECK_RECEIPT,
  columnsParametersEditable,
  componentsEditable,
} from "./model";

import dayjs from "dayjs";
import { delay, comma } from "../../utils/util";
import { ButtonBack } from "../../components/button";
import { useLocation, useNavigate } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LuPackageSearch } from "react-icons/lu";
import { TbExclamationCircle } from "react-icons/tb";
import { CloseCircleFilledIcon } from "../../components/icon";
const opservice = OptionService();
const reservice = ReceiptService();
const dnservice = DeliveryNoteService();
// const qtservice = QuotationService();

const gotoFrom = "/receipt";
const dateFormat = "DD/MM/YYYY";

function ReceiptManage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { config } = location.state || { config: null };
  const [form] = Form.useForm();

  /** Modal handle */
  const [openCustomers, setOpenCustomers] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  // const [openQuotation, setOpenQuotation] = useState(false);

  /** Invoice state */
  const [reCode, setRECode] = useState(null);

  /** Detail Data State */
  const [listDetail, setListDetail] = useState([]);

  const [formDetail, setFormDetail] = useState(DEFALUT_CHECK_RECEIPT);

  const [unitOption, setUnitOption] = React.useState([]);

  const cardStyle = {
    backgroundColor: "#f0f0f0",
    height: "calc(100% - (25.4px + 1rem))",
  };

  useEffect(() => {
    const initial = async () => {
      if (config?.action !== "create") {
        const res = await reservice
          .get(config?.code)
          .catch((error) => message.error("get Receipt data fail."));
        const {
          data: { header, detail },
        } = res.data;
        const { recode, redate, duedate } = header;
        setFormDetail(header);
        setListDetail(detail);
        setRECode(recode);
        form.setFieldsValue({
          ...header,
          redate: dayjs(redate),
          duedate: dayjs(duedate),
          dateFormat,
        });

        // setTimeout( () => {  handleCalculatePrice(head?.valid_price_until, head?.dated_price_until) }, 200);
        // handleChoosedCustomers(head);
      } else {
        const { data: code } = (
          await reservice.code().catch((e) => {
            message.error("get Receipt code fail.");
          })
        ).data;
        setRECode(code);

        const ininteial_value = {
          ...formDetail,
          recode: code,
          redate: dayjs(new Date()),
          duedate: dayjs(new Date()),
          doc_status: "รอออกใบวางบิล",
        };

        setFormDetail(ininteial_value);
        // console.log(formDetail)
        form.setFieldsValue(ininteial_value);
        form.setFieldValue("vat", "7");

        const [unitOprionRes] = await Promise.all([
          opservice.optionsUnit({ p: "unit-option" }),
        ]);
        // console.log(unitOprionRes.data.data)
        setUnitOption(unitOprionRes.data.data);
      }
    };

    initial();
    return () => {};
  }, []);

  useEffect(() => {
    if (listDetail) handleSummaryPrice();
  }, [listDetail]);

  const handleSummaryPrice = () => {
    const newData = [...listDetail];

    const total_price = newData.reduce(
      (a, v) =>
        (a +=
          Number(v.qty || 0) *
          Number(v?.price || 0) *
          (1 - Number(v?.discount || 0) / 100)),
      0
    );
    const vat = form.getFieldValue("vat");
    const grand_total_price =
      total_price + (total_price * form.getFieldValue("vat")) / 100;

    setFormDetail(() => ({
      ...formDetail,
      total_price,
      vat,
      grand_total_price,
    }));
    // console.log(formDetail)
  };
  const handleConfirm = () => {
    form
      .validateFields()
      .then((v) => {
        if (listDetail.length < 1) throw new Error("กรุณาเพิ่ม รายการขาย");

        const header = {
          ...formDetail,
          recode: reCode,
          redate: dayjs(form.getFieldValue("redate")).format("YYYY-MM-DD"),
          duedate: dayjs(form.getFieldValue("duedate")).format("YYYY-MM-DD"),
          remark: form.getFieldValue("remark"),
        };

        const detail = listDetail;
        // console.log(formDetail);
        const parm = { header, detail };
        // console.log(parm);

        const actions =
          config?.action !== "create" ? reservice.update : reservice.create;
        actions(parm)
          .then((r) => {
            handleClose().then((r) => {
              message.success("Request Delivery Note success.");
            });
          })
          .catch((err) => {
            console.log(err);
            message.error(err.response.data.message);
          });
      })
      .catch((err) => {
        Modal.error({
          title: "ข้อมูลยังไม่ครบถ้วน",
          content: "คุณกรอกข้อมูล ไม่ครบถ้วน",
        });
      });
  };
  const handleCalculatePrice = (day, date) => {
    const newDateAfterAdding = dayjs(date || new Date()).add(
      Number(day),
      "day"
    );
    const nDateFormet = newDateAfterAdding.format("YYYY-MM-DD");

    setFormDetail((state) => ({
      ...state,
      dated_grand_total_price_until: nDateFormet,
    }));
    form.setFieldValue("dated_grand_total_price_until", nDateFormet);
  };

  const handleDNDate = (e) => {
    const { valid_grand_total_price_until } = form.getFieldsValue();
    if (!!valid_grand_total_price_until && !!e) {
      handleCalculatePrice(valid_grand_total_price_until || 0, e || new Date());
    }
  };

  /** Function modal handle */
  const handleChoosedCustomers = (val) => {
    // console.log(val)
    const fvalue = form.getFieldsValue();
    const addr = [
      !!val?.idno ? `${val.idno} ` : "",
      !!val?.road ? `${val?.road} ` : "",
      !!val?.subdistrict ? `${val.subdistrict} ` : "",
      !!val?.district ? `${val.district} ` : "",
      !!val?.province ? `${val.province} ` : "",
      !!val?.zipcode ? `${val.zipcode} ` : "",
      !!val?.country ? `(${val.country})` : "",
    ];
    const cusname = [
      !!val?.prename ? `${val.prename} ` : "",
      !!val?.cusname ? `${val.cusname} ` : "",
    ];
    const customers = {
      ...val,
      recode: "",
      cusname: cusname.join(""),
      address: addr.join(""),
      contact: val.contact,
      tel: val?.tel?.replace(/[^(0-9, \-, \s, \\,)]/g, "")?.trim(),
    };
    // console.log(val.contact)
    setFormDetail((state) => ({ ...state, ...customers }));
    form.setFieldsValue({ ...fvalue, ...customers });
    // setListDetail([]);
  };
  const handleChoosedRE = (v) => {
    let value = { detail: v };
    
    dnservice
      .getdetail(value)
      .then((res) => {
        // console.log(res.data)
        const { detail } = res.data;

        setListDetail(detail);
        form.setFieldValue("remark", ((detail[0].cus_doc==='claim_no')?detail[0].claim_no:detail[0].require_no)+'/'+detail[0].car_no);
      })
      .catch((error) => message.error("get Invoice data fail."));
  };

  const handleDelete = (code) => {
    const itemDetail = [...listDetail];
    const newData = itemDetail.filter((item) => item?.dncode !== code);
    setListDetail([...newData]);
  };

  const handleRemove = (record) => {
    const itemDetail = [...listDetail];
    return itemDetail.length >= 1 ? (
      <Button
        className="bt-icon"
        size="small"
        danger
        icon={
          <RiDeleteBin5Line style={{ fontSize: "1rem", marginTop: "3px" }} />
        }
        onClick={() => handleDelete(record?.dncode)}
        disabled={!record?.dncode}
      />
    ) : null;
  };

  const handleCancleRE = () => {
    Modal.confirm({
      title: (
        <Flex align="center" gap={2} className="text-red-700">
          <TbExclamationCircle style={{ fontSize: "1.5rem" }} />
          {"ยืนยันที่จะยกเลิกใบเสร็จรับเงิน"}
        </Flex>
      ),
      icon: <></>,
      content: "ต้องการยกเลิกใบเสร็จรับเงิน ใช่หรือไม่",
      okText: "ยืนยัน",
      okType: "danger",
      cancelText: "ยกเลิก",
      onOk() {
        reservice
          .deleted(formDetail.recode)
          .then((r) => {
            handleClose().then((r) => {
              message.success("ยกเลิกใบเสร็จรับเงินสำเร็จ");
            });
          })
          .catch((err) => {
            message.error("Request Receipt fail.");
            console.warn(err);
          });
        // setListSouce((state) => state.filter( soc => soc.stcode !== key));
      },
      // onCancel() { },
    });
  };

  const handleEditCell = (row) => {
    const newData = (r) => {
      const itemDetail = [...listDetail];
      const newData = [...itemDetail];

      const ind = newData.findIndex((item) => r?.code === item?.code);
      if (ind < 0) return itemDetail;
      const item = newData[ind];
      newData.splice(ind, 1, {
        ...item,
        ...row,
      });

      handleSummaryPrice();
      return newData;
    };
    setListDetail([...newData(row)]);
  };

  /** setting column table */
  const prodcolumns = columnsParametersEditable(handleEditCell, unitOption, {
    handleRemove,
  });

  const SectionCustomers = (
    <>
      <Space size="small" direction="vertical" className="flex gap-2">
        <Row gutter={[8, 8]} className="m-0">
          <Col xs={24} sm={24} md={6} lg={6}>
            <Form.Item
              name="cuscode"
              htmlFor="cuscode-1"
              label="รหัสลูกค้า"
              className="!mb-1"
              rules={[{ required: true, message: "Missing Customer" }]}
            >
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  readOnly
                  placeholder="เลือกลูกค้า"
                  id="cuscode-1"
                  value={form.getFieldValue("cuscode")}
                  className="!bg-white"
                />
                {config?.action !== "create" ? (
                  ""
                ) : (
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => setOpenCustomers(true)}
                    style={{ minWidth: 40 }}
                  ></Button>
                )}
              </Space.Compact>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={18} lg={18}>
            <Form.Item name="cusname" label="ชื่อลูกค้า" className="!mb-1">
              <Input placeholder="ชื่อลูกค้า" readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <Form.Item label="วันที่ครบกำหนด	" name="duedate" className="!m-0">
              <DatePicker
                size="large"
                placeholder="วันที่ครบกำหนด	."
                className="input-40"
                style={{ width: "100%" }}
                format={dateFormat}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={18} lg={18}>
            <Form.Item name="address" label="ที่อยู่" className="!mb-1">
              <Input placeholder="ที่อยู่" readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[8, 8]} className="m-0">
          <Col xs={24} sm={24} md={24} lg={24}>
            <Form.Item className="" name="remark" label="หมายเหตุ">
              <Input.TextArea placeholder="Enter Remark" rows={4} />
            </Form.Item>
          </Col>
        </Row>
      </Space>
    </>
  );

  const TitleTable = (
    <Flex className="width-100" align="center">
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start" align="center">
          <Typography.Title className="m-0 !text-zinc-800" level={3}>
            รายการสินค้า
          </Typography.Title>
        </Flex>
      </Col>
      <Col span={12} style={{ paddingInline: 0 }}>
        <Flex justify="end">
          <Button
            icon={<LuPackageSearch style={{ fontSize: "1.2rem" }} />}
            className="bn-center justify-center bn-primary-outline"
            onClick={() => {
              handleSummaryPrice();
              form.validateFields().then((v) => {
                setOpenProduct(true);
              });
            }}
          >
            เลือกใบส่งสินค้า
          </Button>
        </Flex>
      </Col>
    </Flex>
  );

  const SectionProduct = (
    <>
      <Flex className="width-100" vertical gap={4}>
        <Table
          title={() => TitleTable}
          components={componentsEditable}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={listDetail}
          columns={prodcolumns}
          pagination={false}
          rowKey="code"
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: <span>No data available, please add some data.</span>,
          }}
          summary={(record) => {
            return (
              <>
                {listDetail.length > 0 && (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell
                        index={0}
                        colSpan={9}
                      ></Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={4}
                        align="end"
                        className="!pe-4"
                      >
                        Total
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        className="!pe-4 text-end border-right-0"
                        style={{ borderRigth: "0px solid" }}
                      >
                        <Typography.Text type="danger">
                          {comma(Number(formDetail?.total_price || 0))}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>Baht</Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                      <Table.Summary.Cell
                        index={0}
                        colSpan={8}
                      ></Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={4}
                        align="end"
                        className="!pe-4"
                      >
                        Vat
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        className="!pe-4 text-end border-right-0"
                        style={{ borderRigth: "0px solid" }}
                      >
                        <Form.Item name="vat" className="!m-0">
                          <InputNumber
                            className="width-100 input-30 text-end"
                            addonAfter="%"
                            controls={false}
                            min={0}
                            onFocus={(e) => {
                              e.target.select();
                            }}
                            onChange={() => {
                              handleSummaryPrice();
                            }}
                          />
                        </Form.Item>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        className="!pe-4 text-end border-right-0"
                        style={{ borderRigth: "0px solid" }}
                      >
                        <Typography.Text type="danger">
                          {comma(
                            Number(
                              (formDetail.total_price * formDetail?.vat) / 100
                            )
                          )}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>Baht</Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                      <Table.Summary.Cell
                        index={0}
                        colSpan={9}
                      ></Table.Summary.Cell>
                      <Table.Summary.Cell
                        index={4}
                        align="end"
                        className="!pe-4"
                      >
                        Grand Total
                      </Table.Summary.Cell>
                      <Table.Summary.Cell
                        className="!pe-4 text-end border-right-0"
                        style={{ borderRigth: "0px solid" }}
                      >
                        <Typography.Text type="danger">
                          {comma(Number(formDetail?.grand_total_price || 0))}
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>Baht</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )}
              </>
            );
          }}
        />
      </Flex>
    </>
  );

  const handleClose = async () => {
    navigate(gotoFrom, { replace: true });
    await delay(300);
    // console.clear();
  };
  ///** button */

  const SectionTop = (
    <Row
      gutter={[{ xs: 32, sm: 32, md: 32, lg: 12, xl: 12 }, 8]}
      className="m-0"
    >
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start">
          <ButtonBack target={gotoFrom} />
        </Flex>
      </Col>
      <Col span={12} className="p-0">
        <Flex gap={4} justify="end">
          {formDetail.doc_status === "รอออกใบวางบิล" &&
            config?.action !== "create" && (
              <Popconfirm
                placement="topRight"
                title="ยืนยันการยกเลิก"
                description="คุณแน่ใจที่จะยกเลิกใบเสร็จรับเงิน?"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                onConfirm={() => handleCancleRE()}
              >
                <Button
                  className="bn-center justify-center"
                  icon={<CloseCircleFilledIcon style={{ fontSize: "1rem" }} />}
                  type="primary"
                  style={{ width: "9.5rem" }}
                  danger
                >
                  ยกเลิกใบเสร็จรับเงิน
                </Button>
              </Popconfirm>
            )}
          <Button
            className="bn-center justify-center"
            icon={<SaveFilled style={{ fontSize: "1rem" }} />}
            type="primary"
            style={{ width: "9.5rem", marginLeft: "10px" }}
            onClick={() => {
              handleConfirm();
            }}
          >
            Save
          </Button>
        </Flex>
      </Col>
    </Row>
  );
  const SectionBottom = (
    <Row
      gutter={[{ xs: 32, sm: 32, md: 32, lg: 12, xl: 12 }, 8]}
      className="m-0"
    >
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start">
          <ButtonBack target={gotoFrom} />
        </Flex>
      </Col>
      <Col span={12} className="p-0">
        <Flex gap={4} justify="end">
          <Button
            className="bn-center justify-center"
            icon={<SaveFilled style={{ fontSize: "1rem" }} />}
            type="primary"
            style={{ width: "9.5rem", marginLeft: "10px" }}
            onClick={() => {
              handleConfirm();
            }}
          >
            Save
          </Button>
        </Flex>
      </Col>
    </Row>
  );

  return (
    <div className="dn-manage">
      <div id="dn-manage" className="px-0 sm:px-0 md:px-8 lg:px-8">
        <Space direction="vertical" className="flex gap-4">
          {SectionTop}
          <Form
            form={form}
            layout="vertical"
            className="width-100"
            autoComplete="off"
          >
            <Card
              title={
                <>
                  <Row className="m-0 py-3 sm:py-0" gutter={[12, 12]}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Typography.Title level={3} className="m-0">
                        เลขที่ใบเสร็จรับเงิน : {reCode}
                      </Typography.Title>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Flex
                        gap={10}
                        align="center"
                        className="justify-start sm:justify-end"
                      >
                        <Typography.Title level={3} className="m-0">
                          วันที่ใบเสร็จรับเงิน :{" "}
                        </Typography.Title>
                        <Form.Item name="redate" className="!m-0">
                          <DatePicker
                            className="input-40"
                            allowClear={false}
                            onChange={handleDNDate}
                            format={dateFormat}
                          />
                        </Form.Item>
                      </Flex>
                    </Col>
                  </Row>
                </>
              }
            >
              <Row className="m-0" gutter={[12, 12]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <Divider orientation="left" className="!mb-3 !mt-1">
                    {" "}
                    ข้อมูลใบส่งสินค้า{" "}
                  </Divider>
                  <Card style={cardStyle}>{SectionCustomers}</Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <Divider orientation="left" className="!my-0">
                    รายการใบเสร็จรับเงิน
                  </Divider>
                  <Card style={{ backgroundColor: "#f0f0f0" }}>
                    {SectionProduct}
                  </Card>
                </Col>
              </Row>
            </Card>
          </Form>
          {SectionBottom}
        </Space>
      </div>

      {openCustomers && (
        <ModalCustomersInsurance
          show={openCustomers}
          close={() => setOpenCustomers(false)}
          values={(v) => {
            handleChoosedCustomers(v);
          }}
        ></ModalCustomersInsurance>
      )}

      {openProduct && (
        <ModalDN
          show={openProduct}
          close={() => setOpenProduct(false)}
          cuscode={form.getFieldValue("cuscode")}
          values={(v) => {
            handleChoosedRE(v);
          }}
          selected={listDetail}
        ></ModalDN>
      )}
    </div>
  );
}

export default ReceiptManage;
