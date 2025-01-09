/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "antd";
import { Collapse, Form, Flex, Row, Col, Space, Select } from "antd";
import { Input, Button, Table, message, DatePicker, Typography } from "antd";
import {
  SearchOutlined,
  ClearOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { accessColumn } from "./model";

import dayjs from "dayjs";
import SOService from "../../service/SO.service";
import OptionService from "../../service/Options.service";

const opService = OptionService();
const soservice = SOService();
const mngConfig = {
  title: "",
  textOk: null,
  textCancel: null,
  action: "create",
  code: null,
};

const RangePicker = DatePicker.RangePicker;
const MyAccess = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [accessData, setAccessData] = useState([]);
  const [activeSearch, setActiveSearch] = useState([]);

  const [optionType, setOptionType] = useState([]);
  const [optionKind, setOptionKind] = useState([]);
  const [optionBrand, setOptionBrand] = useState([]);
  const [optionCarmodel, setOptionCarmodel] = useState([]);
  const [optionsModel, setOptionModel] = useState([]);

  let loading = false;

  const handleSearch = (load = false) => {
    loading = load;
    form
      .validateFields()
      .then((v) => {
        const data = { ...v };
        if (!!data?.sodate) {
          const arr = data?.sodate.map((m) => dayjs(m).format("YYYY-MM-DD"));
          const [sodate_form, sodate_to] = arr;
          //data.created_date = arr
          Object.assign(data, { sodate_form, sodate_to });
        }

        setTimeout(() => {
          getData(data);
          GetCarmodel();
        }, 80);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  const CollapseItemSearch = (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item
            label="เลขที่ใบสั่งขาย"
            name="socode"
            onChange={handleSearch}
          >
            <Input placeholder="กรอกเลขที่ใบสั่งขาย" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item
            label="วันที่ใบสั่งขาย"
            name="sodate"
            onChange={handleSearch}
          >
            <RangePicker
              placeholder={["เริ่มวันที่", "ถึงวันที่"]}
              style={{ width: "100%", height: 40 }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="จัดทำโดย" name="created_by" onChange={handleSearch}>
            <Input placeholder="กรอก ชื่อ-นามสกุล ผู้จัดทำ" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="ชื่อสินค้า" name="stname" onChange={handleSearch}>
            <Input placeholder="กรอกชื่อสินค้า" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="รหัสลูกค้า" name="cuscode" onChange={handleSearch}>
            <Input placeholder="กรอกรหัสลูกค้า" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="ชื่อลุูกค้า" name="cusname" onChange={handleSearch}>
            <Input placeholder="กรอกชื่อลูกค้า" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="ประเภท" name="type_name" onChange={handleSearch}>
            <Select
              size="large"
              showSearch
              placeholder="เลือกประเภทสินค้า"
              onChange={handleSearch}
              options={optionType.map((item) => ({
                value: item.type_name,
                label: item.type_name,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="ชนิด" name="kind_name" onChange={handleSearch}>
            <Select
              size="large"
              showSearch
              placeholder="เลือกชนิดสินค้า"
              onChange={handleSearch}
              options={optionKind.map((item) => ({
                value: item.kind_name,
                label: item.kind_name,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="ยี่ห้อ" name="brand_name" onChange={handleSearch}>
            <Select
              size="large"
              showSearch
              placeholder="เลือกยี่ห้อสินค้า"
              onChange={handleSearch}
              options={optionBrand.map((item) => ({
                value: item.brand_name,
                label: item.brand_name,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="แบบ" name="car_model_name" onChange={handleSearch}>
            <Select
              size="large"
              showSearch
              placeholder="เลือกแบบสินค้า"
              onChange={handleSearch}
              options={optionCarmodel.map((item) => ({
                value: item.car_model_name,
                label: item.car_model_name,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="รุ่น" name="model_name" onChange={handleSearch}>
            <Select
              size="large"
              showSearch
              placeholder="เลือกรุ่นสินค้า"
              onChange={handleSearch}
              options={optionsModel.map((item) => ({
                value: item.model_name,
                label: item.model_name,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="ปี" name="year" onChange={handleSearch}>
            <Input placeholder="กรอกปี" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="ทะเบียนรถ" name="car_no" onChange={handleSearch}>
            <Input placeholder="กรอกทะเบียนรถ" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8} md={12} lg={12} xl={12}>
          {/* Ignore */}
        </Col>
        <Col xs={24} sm={8} md={12} lg={12} xl={12}>
          <Flex justify="flex-end" gap={8}>
            <Button
              type="primary"
              size="small"
              className="bn-action"
              icon={<SearchOutlined />}
              onClick={() => handleSearch()}
            >
              Search
            </Button>
            <Button
              type="primary"
              size="small"
              className="bn-action"
              danger
              icon={<ClearOutlined />}
              onClick={() => handleClear()}
            >
              Clear
            </Button>
          </Flex>
        </Col>
      </Row>
    </>
  );

  const FormSearch = (
    <Collapse
      size="small"
      onChange={(e) => {
        setActiveSearch(e);
      }}
      activeKey={activeSearch}
      items={[
        {
          key: "1",
          label: (
            <>
              <SearchOutlined />
              <span> Search</span>
            </>
          ),
          children: <>{CollapseItemSearch}</>,
          showArrow: false,
        },
      ]}
      // bordered={false}
    />
  );

  const handleClear = () => {
    form.resetFields();

    handleSearch();
  };
  // console.log(form);
  const hangleAdd = () => {
    navigate("manage/create", {
      state: {
        config: {
          ...mngConfig,
          title: "สร้างใบสั่งขายสินค้า",
          action: "create",
        },
      },
    });
  };

  const handleEdit = (data) => {
    navigate("manage/edit", {
      state: {
        config: {
          ...mngConfig,
          title: "แก้ไขใบสั่งขายสินค้า",
          action: "edit",
          code: data?.socode,
        },
      },
      replace: true,
    });
  };

  const handlePrintsData = (code) => {
    const url = `/so-print/${code}`;
    const newWindow = window.open("", url, url);
    newWindow.location.href = url;
  };

  const column = accessColumn({ handleEdit, handlePrintsData });

  const getData = (data) => {
    soservice
      .search(data, { ignoreLoading: loading })
      .then((res) => {
        const { data } = res.data;

        setAccessData(data);
      })
      .catch((err) => {
        console.log(err);
        message.error("Request error!");
      });
  };

  const init = async () => {
    getData({});
  };

  useEffect(() => {
    init();
    GetType();
    GetKind();
    GetBrand();
    GetCarmodel();
    GetModel();
    return async () => {
      //console.clear();
    };
  }, []);

  const GetType = () => {
    opService.optionsType().then((res) => {
      let { data } = res.data;
      setOptionType(data);
    });
  };

  const GetKind = () => {
    opService.optionsKind().then((res) => {
      let { data } = res.data;
      setOptionKind(data);
    });
  };

  const GetBrand = () => {
    opService.optionsBrand().then((res) => {
      let { data } = res.data;
      setOptionBrand(data);
    });
  };

  const GetCarmodel = () => {
    let brand_name = form.getFieldValue("brand_name");
    opService.optionsCarmodel({ brand_name: brand_name }).then((res) => {
      let { data } = res.data;
      setOptionCarmodel(data);
    });
  };

  const GetModel = () => {
    opService.optionsModel().then((res) => {
      let { data } = res.data;
      setOptionModel(data);
    });
  };

  const TitleTable = (
    <Flex className="width-100" align="center">
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start" align="center">
          <Typography.Title className="m-0 !text-zinc-800" level={3}>
            หน้าจัดการใบสั่งขายสินค้า (Sales Order)
          </Typography.Title>
        </Flex>
      </Col>
      <Col span={12} style={{ paddingInline: 0 }}>
        <Flex gap={4} justify="end">
          <Button
            size="small"
            className="bn-action bn-center bn-primary-outline justify-center"
            icon={<FileAddOutlined style={{ fontSize: ".9rem" }} />}
            onClick={() => {
              hangleAdd();
            }}
          >
            เพิ่มใบสั่งขายสินค้า
          </Button>
        </Flex>
      </Col>
    </Flex>
  );
  return (
    <div className="so-access" id="area">
      <Space
        direction="vertical"
        size="middle"
        style={{ display: "flex", position: "relative" }}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onValuesChange={() => {
            handleSearch(true);
          }}
        >
          {FormSearch}
        </Form>
        <Card>
          <Row gutter={[8, 8]} className="m-0">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Table
                title={() => TitleTable}
                size="small"
                rowKey="socode"
                columns={column}
                dataSource={accessData}
                scroll={{ x: "max-content" }}
              />
            </Col>
          </Row>
        </Card>
      </Space>
    </div>
  );
};

export default MyAccess;
