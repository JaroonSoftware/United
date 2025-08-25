/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Divider, Form, Input, Button, Flex, message, Select } from "antd";
import { Row, Col, Space } from "antd";

import { SaveFilled } from "@ant-design/icons";

// import { supplier } from '../../../pages/supplier/supplier.model.js';

import CustomerService from "../../../service/Customer.Service.js";
import { CreateInput } from "thai-address-autocomplete-react";

const InputThaiAddress = CreateInput();
const ctmService = CustomerService();

const ModalDeliveryCustomersManage = ({ submit }) => {
  const [form] = Form.useForm();

  const [formDetail, setFormDetail] = useState();
  const { Option } = Select;

  // const [packageTypeOption, setPackageTypeOption] = useState([]);
  const init = async () => {
    const cuscodeRes = await ctmService
      .getcode()
      .catch(() => message.error("Initail failed"));

    const { data: cuscode } = cuscodeRes.data;
    const initForm = {
      ...formDetail,
      cuscode,
      cus_doc: "claim_no",
      pre_subdistrict: "ตำบล",
      pre_district: "อำเภอ",
      pre_delsubdistrict: "ตำบล",
      pre_deldistrict: "อำเภอ",
    };
    setFormDetail((state) => ({ ...state, ...initForm }));
    form.setFieldsValue(initForm);
  };

  useEffect(() => {
    init();
    return () => {};
  }, []);

  const handleSelect = (address) => {
    const f = form.getFieldsValue();
    const addr = {
      ...f,
      province: `จ.${address.province}`,
      zipcode: `${address.zipcode}`,
      subdistrict: `ต.${address.district}`,
      district: `อ.${address.amphoe}`,
    };
    setFormDetail(addr);
    form.setFieldsValue(addr);
  };
  const CopyAddress = () => {
    const f = form.getFieldsValue();
    const addr = {
      ...f,
      delidno: f.idno,
      delroad: f.road,
      delprovince: f.province,
      delzipcode: f.zipcode,
      pre_delsubdistrict: f.pre_subdistrict,
      delsubdistrict: f.subdistrict,
      pre_deldistrict: f.pre_district,
      deldistrict: f.district,
    };
    setFormDetail(addr);
    form.setFieldsValue(addr);
    message.success("คัดลอกสำเร็จ.");
  };

  const handleDeliverySelect = (address) => {
    const f = form.getFieldsValue();
    const addr = {
      ...f,
      delprovince: `จ.${address.province}`,
      delzipcode: `${address.zipcode}`,
      delsubdistrict: `ต.${address.district}`,
      deldistrict: `อ.${address.amphoe}`,
    };
    setFormDetail(addr);
    form.setFieldsValue(addr);
  };

  const handleConfirm = () => {
    form.validateFields().then((v) => {
      const source = { ...formDetail, ...v };
      submit(source);
    });
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const Detail = () => (
    <Row gutter={[8, 8]} className="px-2 sm:px-4 md:px-4 lg:px-4">
      <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
        <Form.Item
          label="รหัสลูกค้าที่จัดส่ง"
          name="cuscode"
          rules={[{ required: true, message: "Please enter data!" }]}
        >
          <Input
            placeholder="กรอกรหัสลูกค้าที่จัดส่ง"
            className="!bg-zinc-300"
            readOnly
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={4} xl={4} xxl={4}>
        <Form.Item
          label="คำน้ำหน้า"
          name="prename"
          rules={[{ required: true, message: "Please enter data!" }]}
        >
          <Select
            size="large"
            showSearch
            filterOption={filterOption}
            options={[
              {
                value: "บจก.",
                label: "บจก.",
              },
              {
                value: "หจก.",
                label: "หจก.",
              },
              {
                value: "คุณ",
                label: "คุณ",
              },
              {
                value: "นาย",
                label: "นาย",
              },

              {
                value: "นางสาว",
                label: "นางสาว",
              },

              {
                value: "นาง",
                label: "นาง",
              },
            ]}
          ></Select>
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={14} xl={14} xxl={14}>
        <Form.Item
          label="ชื่อลูกค้าที่จัดส่ง"
          name="cusname"
          rules={[{ required: true, message: "Please enter data!" }]}
        >
          <Input placeholder="กรอกชื่อลูกค้าที่จัดส่ง" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
        <Form.Item label="เลขที่ผู้เสียภาษี" name="taxnumber">
          <Input placeholder="Enter Tax Number." />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
        <Form.Item
          label="รหัสเอกสารอ้างอิง"
          name="cus_doc"
          rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
        >
          <Select
            size="large"
            showSearch
            filterOption={filterOption}
            placeholder="เลือกรหัสเอกสารอ้างอิง"
            options={[
              {
                value: "claim_no",
                label: "เลขที่เคลม",
              },
              {
                value: "require_no",
                label: "เลขรับแจ้ง",
              },
            ]}
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
        <Form.Item
          label="สาขา"
          name="branch"
          rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
        >
          <Select
            size="large"
            showSearch
            filterOption={filterOption}
            placeholder="เลือกสาขา"
          >
            <Option value="สำนักงานใหญ่">สำนักงานใหญ่</Option>
            <Option value="สาขา">สาขา</Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );

  const AddressDetail = () => (
    <Row gutter={[8, 8]} className="px-2 sm:px-4 md:px-4 lg:px-4">
      <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6}>
        <Form.Item label="เลขที่" name="idno">
          <Input placeholder="กรอกเลขที่อยู่" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6}>
        <Form.Item label="ถนน" name="road">
          <Input placeholder="กรอกถนน" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={4} xxl={4}>
        <Form.Item label="&nbsp;" name="pre_subdistrict">
          <Select size="large" showSearch filterOption={filterOption}>
            <Option value="ตำบล">ตำบล</Option>
            <Option value="แขวง">แขวง</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
        <Form.Item label="&nbsp;" name="subdistrict">
          <InputThaiAddress.District
            onSelect={handleSelect}
            style={{ height: 40 }}
            autoCompleteProps={{ placeholder: "กรอกตำบล" }}
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={4} xxl={4}>
        <Form.Item label="&nbsp;" name="pre_district">
          <Select size="large" showSearch filterOption={filterOption}>
            <Option value="อำเภอ">อำเภอ</Option>
            <Option value="เขต">เขต</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
        <Form.Item label="&nbsp;" name="district">
          <InputThaiAddress.Amphoe
            onSelect={handleSelect}
            style={{ height: 40 }}
            autoCompleteProps={{ placeholder: "กรอกอำเภอ" }}
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
        <Form.Item label="จังหวัด" name="province">
          <InputThaiAddress.Province
            onSelect={handleSelect}
            style={{ height: 40 }}
            autoCompleteProps={{ placeholder: "กรอกจังหวัด" }}
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
        <Form.Item label="รหัสไปรษณีย์" name="zipcode">
          <InputThaiAddress.Zipcode
            onSelect={handleSelect}
            style={{ height: 40 }}
            autoCompleteProps={{ placeholder: "กรอกรหัสไปรษณีย์" }}
          />
        </Form.Item>
      </Col>
    </Row>
  );

  const DeliveryAddressDetail = () => (
    <>
      <Row gutter={[8, 8]} className="px-2 sm:px-4 md:px-4 lg:px-4">
        <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6}>
          <Form.Item label="เลขที่" name="delidno">
            <Input placeholder="กรอกเลขที่อยู่" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6}>
          <Form.Item label="ถนน" name="delroad">
            <Input placeholder="กรอกถนน" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={4} xxl={4}>
          <Form.Item label="&nbsp;" name="pre_delsubdistrict">
            <Select size="large" showSearch filterOption={filterOption}>
              <Option value="ตำบล">ตำบล</Option>
              <Option value="แขวง">แขวง</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>
          <Form.Item label="&nbsp;" name="delsubdistrict">
            <InputThaiAddress.District
              onSelect={handleDeliverySelect}
              style={{ height: 40 }}
              autoCompleteProps={{ placeholder: "กรอกตำบล" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={4} xxl={4}>
          <Form.Item label="&nbsp;" name="pre_deldistrict">
            <Select size="large" showSearch filterOption={filterOption}>
              <Option value="อำเภอ">อำเภอ</Option>
              <Option value="เขต">เขต</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>
          <Form.Item label="&nbsp;" name="deldistrict">
            <InputThaiAddress.Amphoe
              onSelect={handleDeliverySelect}
              style={{ height: 40 }}
              autoCompleteProps={{ placeholder: "กรอกอำเภอ" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
          <Form.Item label="จังหวัด" name="delprovince">
            <InputThaiAddress.Province
              onSelect={handleDeliverySelect}
              style={{ height: 40 }}
              autoCompleteProps={{ placeholder: "กรอกจังหวัด" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={8}>
          <Form.Item label="รหัสไปรษณีย์" name="delzipcode">
            <InputThaiAddress.Zipcode
              onSelect={handleDeliverySelect}
              style={{ height: 40 }}
              autoCompleteProps={{ placeholder: "กรอกรหัสไปรษณีย์" }}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );

  const ContactDetail = () => (
    <Row gutter={[8, 8]} className="px-2 sm:px-4 md:px-4 lg:px-4">
      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
        <Form.Item label="ติดต่อ" name="contact">
          <Input placeholder="Enter Contact." />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
        <Form.Item label="อีเมล" name="email">
          <Input placeholder="Enter Email." />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
        <Form.Item label="เบอร์โทรศัพท์" name="tel">
          <Input placeholder="Enter Tel Number." />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
        <Form.Item label="เบอร์แฟ็ค" name="fax">
          <Input placeholder="Enter Fax Number." />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
        <Form.Item label="หมายเหตุ" name="remark">
          <Input.TextArea placeholder="Enter Remark." rows={4} />
        </Form.Item>
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
          {/* <ButtonBack target={from} /> */}
        </Flex>
      </Col>
      <Col span={12} style={{ paddingInline: 0 }}>
        <Flex gap={4} justify="end">
          <Button
            icon={<SaveFilled style={{ fontSize: "1rem" }} />}
            type="primary"
            style={{ width: "9.5rem" }}
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
    <div className="supplier-manage xs:px-0 sm:px-0 md:px-8 lg:px-8">
      <Space direction="vertical" className="flex gap-2">
        <Form form={form} layout="vertical" autoComplete="off">
          <Divider orientation="left" plain style={{ margin: 10 }}>
            {" "}
            Information Detail{" "}
          </Divider>
          <Detail />

          <Divider orientation="left" plain style={{ margin: 10 }}>
            {" "}
            Address Detail
          </Divider>
          <AddressDetail />

          <Row gutter={[8, 8]} className="px-2 sm:px-4 md:px-4 lg:px-4">
            <Col xs={24} sm={24} md={24} lg={18} xl={20} xxl={20}>
              <Divider orientation="left" plain style={{ margin: 10 }}>
                {" "}
                Delivery Address Detail
              </Divider>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={4} xxl={4}>
              <div align="right">
                <Button
                  icon={<SaveFilled style={{ fontSize: "1rem" }} />}
                  type="primary"
                  style={{ width: "9.5rem" }}
                  onClick={() => {
                    CopyAddress();
                  }}
                >
                  คัดลอกที่อยู่
                </Button>
              </div>
            </Col>
          </Row>
          <DeliveryAddressDetail />

          <Divider orientation="left" plain style={{ margin: 10 }}>
            {" "}
            Contact Detail
          </Divider>
          <ContactDetail />
        </Form>
        {SectionBottom}
      </Space>
    </div>
  );
};

export default ModalDeliveryCustomersManage;
