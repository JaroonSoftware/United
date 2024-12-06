/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import {
  Modal,
  Card,
  Form,
  Button,
  Typography,
  Select,
  DatePicker,
  Divider,
  InputNumber,
} from "antd";
import { Row, Col, Space, Spin, Flex } from "antd";
import { Input } from "antd";
import { BankTwoTone } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

import { BsUiChecks } from "react-icons/bs";
import { comma } from "../../../utils/util";
import dayjs from "dayjs";

import OptionService from "../../../service/Options.service";
const { TextArea } = Input;
const dateFormat = "DD/MM/YYYY";
const opservice = OptionService();

export default function ModalBanks({
  show,
  close,
  recode,
  total_price,
  values,
}) {
  const [form] = useForm();

  const [openModal, setOpenModel] = useState(show);
  const [loading, setLoading] = useState(true);

  const [banksOption, setBanksOption] = useState([]);
  const [banksOptionData, setBanksOptionDate] = useState([]);
  const [balance, setBalance] = useState(0);
  // console.log( itemsTypeData )

  /** handle logic component */
  const handleClose = () => {
    setTimeout(() => {
      close(false);
    }, 140);

    //setTimeout( () => close(false), 200 );
  };

  const onFinish = () => {    

    const bnk = banksOptionData.find(
      (d) => d.key === form.getFieldValue("bank")
    );

    values({
      ...form.getFieldsValue(),
      recode:recode,
      bank_name: bnk?.official_name,
      bank_name_th: bnk?.thai_name,
      bank_nickname: bnk?.nice_name,
    });
    setTimeout(() => {
      close(false);
    }, 140);
  };

  const onChangeMoney = (value) => {
    setBalance(total_price - value)
  };

  /** setting initial component */
  const onload = async () => {
    setLoading(true);

    form.setFieldValue("price", total_price);
    form.setFieldValue("paydate", dayjs(new Date()));
    const [lbanksRes] = await Promise.all([opservice.optionsBanks()]).finally(
      () =>
        setTimeout(() => {
          setLoading(false);
        }, 400)
    );
    const { data: banksOptionData } = lbanksRes.data;

    const opnLtd = banksOptionData.map((v) => ({
      value: v.key,
      label: (
        <>
          <Flex align="center" gap={8}>
            <i
              className={`bank bank-${v.key} shadow huge`}
              style={{ height: 28, width: 28 }}
            ></i>
            <Flex align="start" gap={1} vertical>
              {/* <Typography.Text ellipsis style={{ fontSize: 13 }}>{v.thai_name}</Typography.Text>  */}
              <Typography.Text
                ellipsis={true}
                style={{ fontSize: 11, color: "#8c8386" }}
              >
                {v.official_name}
              </Typography.Text>
            </Flex>
          </Flex>
        </>
      ),
      record: v,
    }));
    setBanksOption(opnLtd);
    setBanksOptionDate(banksOptionData);
  };

  useEffect(() => {
    if (!!openModal) {
      onload();
      // console.log("modal-packages")
    }
  }, [openModal]);  

  return (
    <>
      <Modal
        open={openModal}
        title={
          <>
            <BankTwoTone />
            <Typography.Text className="ms-1 mb-0">
              บันทึกการชำระเงิน
            </Typography.Text>
          </>
        }
        afterClose={() => handleClose()}
        onCancel={() => setOpenModel(false)}
        maskClosable={false}
        style={{ top: 20 }}
        width={670}
        className="modal-payment"
        footer={
          <Row>
            <Col span={24}>{/* Ignore */}</Col>
            <Col span={24}>
              <Flex justify="flex-end">
                <Button
                  className="bn-center bn-primary"
                  icon={<BsUiChecks />}
                  onClick={() => onFinish()}
                >
                  Confirm
                </Button>
              </Flex>
            </Col>
          </Row>
        }
      >
        <Spin spinning={loading}>
          <Space
            direction="vertical"
            size="middle"
            style={{ display: "flex", position: "relative" }}
          >
            <Card>
              <Form
                form={form}
                labelCol={{
                  span: 5,
                }}
                wrapperCol={{
                  span: 14,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 900,
                }}
              >
                <Col xs={24} sm={24} md={24} xl={24}>
                  <Form.Item
                    name="recode"
                    label="เลขที่เอกสาร"
                    className="!mb-1"
                    style={{ width: "100%" }}
                  >
                    {recode}
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} xl={24}>
                  <Form.Item
                    label="ยอดที่ต้องชำระ"
                    className="!mb-1"
                    style={{ width: "100%" }}
                  >
                    {comma(Number(total_price || 0), 2, 2)} บาท
                  </Form.Item>
                </Col>
                <br></br>
                <Col xs={24} sm={24} md={24} xl={24}>
                  <Form.Item
                    name="paydate"
                    label="วันที่รับชำระ"
                    className="!mb-1"
                    style={{ width: "100%" }}
                    rules={[{ required: true, message: "วันที่รับชำระ" }]}
                  >
                    <DatePicker
                      style={{ height: 28, width: 320 }}
                      placeholder="เลือกวันที่รับชำระ"
                      format={dateFormat}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} xl={24}>
                  <Form.Item
                    name="price"
                    label="ยอดรับชำระ"
                    className="!mb-1"
                    style={{ width: "100%" }}
                    rules={[{ required: true, message: "กรุณากรอกยอดเงิน" }]}
                  >
                    <InputNumber
                      max={total_price}
                      style={{ height: 28, width: 320 }}        
                      onChange={onChangeMoney}              
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} xl={24}>
                  <Form.Item
                    name="payment_type"
                    label="ช่องทางรับชำระ"
                    className="!mb-1"
                    style={{ width: "100%" }}
                    rules={[{ required: true, message: "เลือกช่องทางรับ" }]}
                  >
                    <Select style={{ height: 28, width: 320 }}>
                      <Select.Option value="เงินสด">เงินสด</Select.Option>
                      <Select.Option value="เงินโอน">เงินโอน</Select.Option>
                      <Select.Option value="เช็ค">
                      เช็ค
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <Form.Item
                    name="bank"
                    label="ธนาคาร"
                    className="!mb-1"
                  >
                    <Select
                      showSearch
                      autoClearSearchValue
                      style={{ height: 28, width: 320 }}
                      options={banksOption}
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        const { record: v } = option;
                        const val = input?.toLowerCase();
                        return (
                          (v?.official_name?.toLowerCase() ?? "").includes(
                            val
                          ) ||
                          (v?.thai_name?.toLowerCase() ?? "").includes(val) ||
                          (v?.key?.toLowerCase() ?? "").includes(val)
                        );
                      }}
                      filterSort={(optionA, optionB) => {
                        const { record: v1 } = optionA;
                        const { record: v2 } = optionB;

                        return (v1?.official_name ?? "")
                          .toLowerCase()
                          .localeCompare(
                            (v2?.official_name ?? "").toLowerCase()
                          );
                      }}
                      optionLabelProp="label"
                      optionRender={(option) => {
                        const { record: v } = option.data;
                        return (
                          <>
                            <Flex align="self-end" gap={8}>
                              <i
                                className={`bank bank-${v.key} shadow huge flex flex-grow-1`}
                                style={{
                                  height: 34,
                                  width: 34,
                                  minWidth: 34,
                                }}
                              ></i>
                              <Flex align="start" gap={1} vertical>
                                <Typography.Text
                                  ellipsis
                                  style={{ fontSize: 13, maxWidth: "100%" }}
                                >
                                  {v.thai_name}
                                </Typography.Text>
                                <Typography.Text
                                  ellipsis
                                  style={{
                                    fontSize: 11,
                                    color: "#8c8386",
                                    maxWidth: "100%",
                                  }}
                                >
                                  {v.official_name}
                                </Typography.Text>
                              </Flex>
                            </Flex>
                          </>
                        );
                      }}
                      allowClear
                      placeholder="เลือกธนาคารที่ต้องการชำระเงิน"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} xl={24}>
                <Form.Item
                    name="bank_no"
                    label="เลขที่บัญชี"
                    size="small"
                    className="!mb-1"
                    style={{ width: "100%" }}
                  >
                    <Input placeholder="เลขที่บัญชี" style={{ height: 28, width: 320 }}    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={24} md={24} xl={24}>
                  <Form.Item
                    name="remark"
                    label="หมายเหตุ"
                    className="!mb-1"
                    style={{ width: "100%" }}
                  >
                    <TextArea style={{ width: 320 }} rows={2} />
                  </Form.Item>
                </Col>
                <Divider />
                <Col xs={24} sm={24} md={24} xl={24}>
                  <Form.Item
                    label="ยอดคงเหลือ"
                    className="!mb-1"
                    style={{ width: "100%", color: "#e74c3c" }}
                  >
                    {balance} บาท
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} xl={24}>
                  <Form.Item
                    label="ระบุสาเหตุ"
                    className="!mb-1"
                    style={{ width: "100%" }}
                  >
                    <Select style={{ height: 28, width: 320 }} disabled>
                      <Select.Option value="เงินขาด/เงินเกิน">
                        เงินขาด/เงินเกิน
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Form>
            </Card>
          </Space>
        </Spin>
      </Modal>
    </>
  );
}
