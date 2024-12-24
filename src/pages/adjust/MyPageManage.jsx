/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Table,
  Typography,
  message,
  Popconfirm,
} from "antd";
import { Card, Col, Divider, Flex, Row, Space } from "antd";
import OptionService from "../../service/Options.service";
import AdjustService from '../../service/Adjust.service';
import { SaveFilled, QuestionCircleOutlined } from "@ant-design/icons";
import {
  adjustForm,
  columnsParametersEditable,
  componentsEditable,
} from "./model";
import { ModalItems } from "../../components/modal/items/modal-items";
import dayjs from "dayjs";
import { delay, comma } from "../../utils/util";
import { ButtonBack } from "../../components/button";
import { useLocation, useNavigate } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LuPackageSearch } from "react-icons/lu";
import { CloseCircleFilledIcon } from '../../components/icon';

const opservice = OptionService();
const adservice = AdjustService();
const gotoFrom = "/adjust";
const dateFormat = "DD/MM/YYYY";
function AdjustManage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { config } = location.state || { config: null };
  const [form] = Form.useForm();
  /** Modal handle */
  const [openProduct, setOpenProduct] = useState(false);
  /** Adjust state */
  const [adCode, setAdCode] = useState(null);
  /** Detail Data State */
  const [listDetail, setListDetail] = useState([]);
  const [formDetail, setFormDetail] = useState(adjustForm);
  const [unitOption, setUnitOption] = React.useState([]);
  const cardStyle = {
    backgroundColor: "#f0f0f0",
    height: "calc(100% - (25.4px + 1rem))",
  };

  useEffect(() => {
    const initial = async () => {
      if (config?.action !== "create") {
        const res = await adservice
          .get(config?.code)
          .catch((error) => message.error("get Adjust data fail."));
        // console.log(res.data)
        const { header, detail } = res.data;
        const { adcode, addate } = header;

        setFormDetail(header);
        setListDetail(detail);
        setAdCode(adcode);
        form.setFieldsValue({
          ...header,
          addate: dayjs(addate),
        });

        // setTimeout( () => {  handleCalculatePrice(head?.valid_price_until, head?.dated_price_until) }, 200);
        // handleChoosedSupplier(head);
      } else {
        const { data: code } = (
          await adservice.code().catch((e) => {
            message.error("get Adjust code fail.");
          })
        ).data;
        setAdCode(code);

        const ininteial_value = {
          ...formDetail,
          adcode: code,
          addate: dayjs(new Date()),
        };

        setFormDetail(ininteial_value);
        form.setFieldsValue(ininteial_value);
      }
      const [unitOprionRes] = await Promise.all([
        opservice.optionsUnit({ p: "unit-option" }),
      ]);
      // console.log(unitOprionRes.data.data)
      setUnitOption(unitOprionRes.data.data);
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

    setFormDetail(() => ({
      ...formDetail,
      total_price,
    }));
    // console.log(formDetail)
  };

  const handleCalculatePrice = (day, date) => {
    const newDateAfterAdding = dayjs(date || new Date()).add(
      Number(day),
      "day"
    );
    const nDateFormet = newDateAfterAdding.format("YYYY-MM-DD");

    setFormDetail((state) => ({ ...state, dated_price_until: nDateFormet }));
  };

  const handleQuotDate = (e) => {
    const { valid_price_until } = form.getFieldsValue();
    if (!!valid_price_until && !!e) {
      handleCalculatePrice(valid_price_until || 0, e || new Date());
    }
  };

  /** Function modal handle */
  const handleItemsChoosed = (value) => {
    // console.log(value);
    setListDetail(value);
    handleSummaryPrice();
  };

  const handleConfirm = () => {
    form
      .validateFields()
      .then((v) => {
        if (listDetail.length < 1) throw new Error("กรุณาเพิ่ม รายการขาย");

        const header = {
          ...formDetail,
          addate: dayjs(form.getFieldValue("addate")).format("YYYY-MM-DD"),
          deldate: dayjs(form.getFieldValue("deldate")).format("YYYY-MM-DD"),
          payment: form.getFieldValue("payment"),
          poqua: form.getFieldValue("poqua"),
          remark: form.getFieldValue("remark"),
          vat: form.getFieldValue("vat"),
        };
        const detail = listDetail;

        const parm = { header, detail };
        // console.log(parm)
        const actions =
          config?.action !== "create" ? adservice.update : adservice.create;
        actions(parm)
          .then((r) => {
            handleClose().then((r) => {
              message.success("Request Adjust success.");
            });
          })
          .catch((err) => {
            message.error("Request Adjust fail.");
            console.warn(err);
          });
      })
      .catch((err) => {
        Modal.error({
          title: "ข้อมูลยังไม่ครบถ้วน",
          content: "กรุณากรอกข้อมูลให้ครบ",
        });
      });
  };

  const handleCancel = () => {
    adservice.deleted(config?.code).then( _ => {
      handleClose().then((r) => {
        message.success( "ยกเลิกใบปรับสต๊อกเรียบร้อย." ); 
      });
    })
    .catch( err => {
        console.warn(err);
        const { data:{ message:mes } } = err.response;
        message.error( mes || "error request"); 
    });
}

  const handleClose = async () => {
    navigate(gotoFrom, { replace: true });
    await delay(300);
    console.clear();
  };

  const handleDelete = (code) => {
    const itemDetail = [...listDetail];
    const newData = itemDetail.filter((item) => item?.code !== code);
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
        onClick={() => handleDelete(record?.code)}
        disabled={
          !record?.code || formDetail.doc_status !== "ยังไม่ได้รับของ"
        }
      />
    ) : null;
  };

  const handleEditCell = (row) => {
    const newData = (r) => {
      const itemDetail = [...listDetail];
      const newData = [...itemDetail];

      const ind = newData.findIndex((item) => r?.stcode === item?.stcode);
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
              setOpenProduct(true);
            }}
            disabled={formDetail.doc_status !== "ยังไม่ได้รับของ"}
          >
            Choose Product
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
                        colSpan={7}
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
                  </>
                )}
              </>
            );
          }}
        />
      </Flex>
    </>
  );

  const SectionOther = (
    <>
      <Space size="small" direction="vertical" className="flex gap-2">
        <Row gutter={[8, 8]} className="m-0">
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            <Form.Item className="" name="remark" label="Remark">
              <Input.TextArea placeholder="Enter Remark" rows={4} />
            </Form.Item>
          </Col>
        </Row>
      </Space>
    </>
  );

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
      <Col span={12} style={{ paddingInline: 0 }}>
        <Flex gap={4} justify="end">
          {(formDetail.doc_status === "ยังไม่ได้รับของ"&&config?.action !== "create")&&
          <Popconfirm 
          placement="topRight"
          title="ยืนยันการยกเลิก"  
          description="คุณแน่ใจที่จะยกเลิกใบปรับสต๊อก?"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => handleCancel()}
        >
          <Button
            className="bn-center justify-center"
            icon={<CloseCircleFilledIcon style={{ fontSize: "1rem" }} />}
            type="primary"
            style={{ width: "9.5rem" }}
            danger
          >
            ยกเลิกใบปรับสต๊อก
          </Button>
        </Popconfirm>
          }
          <Button
            className="bn-center justify-center"
            icon={<SaveFilled style={{ fontSize: "1rem" }} />}
            type="primary"
            style={{ width: "9.5rem" }}
            onClick={() => {
              handleConfirm();
            }}
            disabled={formDetail.doc_status !== "ยังไม่ได้รับของ"}
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
      <Col span={12} style={{ paddingInline: 0 }}>
        <Flex gap={4} justify="end">
          <Button
            className="bn-center justify-center"
            icon={<SaveFilled style={{ fontSize: "1rem" }} />}
            type="primary"
            style={{ width: "9.5rem" }}
            onClick={() => {
              handleConfirm();
            }}
            disabled={formDetail.doc_status !== "ยังไม่ได้รับของ"}
          >
            Save
          </Button>
        </Flex>
      </Col>
    </Row>
  );

  return (
    <div className="purchaseorder-manage">
      <div id="purchaseorder-manage" className="px-0 sm:px-0 md:px-8 lg:px-8">
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
                        รหัสใบปรับสต๊อก : {adCode}
                      </Typography.Title>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                      <Flex
                        gap={10}
                        align="center"
                        className="justify-start sm:justify-end"
                      >
                        <Typography.Title level={3} className="m-0">
                          วันที่ใบปรับสต๊อก :{" "}
                        </Typography.Title>
                        <Form.Item name="addate" className="!m-0">
                          <DatePicker
                            className="input-40"
                            allowClear={false}
                            onChange={handleQuotDate}
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
                    หมายเหตุ{" "}
                  </Divider>
                  <Card style={cardStyle}>{SectionOther}</Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <Divider orientation="left" className="!my-0">
                    รายการสินค้าใบปรับสต๊อก
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

      {openProduct && (
        <ModalItems
          show={openProduct}
          close={() => setOpenProduct(false)}
          values={(v) => {
            handleItemsChoosed(v);
          }}
          selected={listDetail}
        ></ModalItems>
      )}
    </div>
  );
}

export default AdjustManage;
