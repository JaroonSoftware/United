/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, message } from "antd";
import { Collapse, Form, Flex, Row, Col, Space, Select } from "antd";
import { Input, Button, Table, Typography } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { accessColumn } from "./model";
import OptionService from "../../service/Options.service";
// import dayjs from 'dayjs';
import Itemservice from "../../service/Items.Service";
const opService = OptionService();
const itemservice = Itemservice();
const mngConfig = {
  title: "",
  textOk: null,
  textCancel: null,
  action: "create",
  code: null,
};
const ItemsAccess = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [accessData, setAccessData] = useState([]);
  const [activeSearch, setActiveSearch] = useState([]);

  const [optionType, setOptionType] = useState([]);
  const [optionKind, setOptionKind] = useState([]);
  const [optionBrand, setOptionBrand] = useState([]);
  const [optionCarmodel, setOptionCarmodel] = useState([]);
  const [optionsModel, setOptionModel] = useState([]);
  const handleSearch = () => {
    form.validateFields().then((v) => {
      const data = { ...v };
      itemservice
        .search(data, { ignoreLoading: Object.keys(data).length !== 0 })
        .then((res) => {
          const { data } = res.data;

          setAccessData(data);
        })
        .catch((err) => {
          console.log(err);
          message.error("Request error!");
        });
    });
  };

  const handleClear = () => {
    form.resetFields();

    handleSearch();
  };

  const hangleAdd = () => {
    navigate("manage/create", {
      state: {
        config: {
          ...mngConfig,
          title: "เพิ่มสินค้า",
          action: "create",
        },
      },
      replace: true,
    });
  };

  const handleEdit = (data) => {
    // setManageConfig({...manageConfig, title:"แก้ไข Sample Request", action:"edit", code:data?.srcode});
    navigate("manage/edit", {
      state: {
        config: {
          ...mngConfig,
          title: "แก้ไขข้อมูลสินค้า",
          action: "edit",
          code: data?.stcode,
        },
      },
      replace: true,
    });
  };

  const handleView = (data) => {
    const newWindow = window.open("", "_blank");
    newWindow.location.href = `/dln-print/${data.dncode}`;
  };

  const handleDelete = (data) => {
    // startLoading();
    // ctmService.deleted(data?.dncode).then( _ => {
    //     const tmp = accessData.filter( d => d.dncode !== data?.dncode );
    //     setAccessData([...tmp]);
    // })
    // .catch(err => {
    //     console.log(err);
    //     message.error("Request error!");
    // });
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

  const getData = () => {
    handleSearch();
  };

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

  const FormSearch = (
    <Collapse
      size="small"
      onChange={(e) => {
        setActiveSearch(e);
      }}
      bordered={false}
      activeKey={activeSearch}
      items={[
        {
          key: "1",
          label: (
            <>
              <SearchOutlined />
              <span> ค้นหา</span>
            </>
          ),
          children: (
            <>
              <Form form={form} layout="vertical" autoComplete="off">
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                    <Form.Item
                      label="รหัสสินค้า"
                      name="stcode"
                      onChange={handleSearch}
                    >
                      <Input placeholder="กรอกรหัสสินค้า" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                    <Form.Item
                      label="ชื่อสินค้า"
                      name="stname"
                      onChange={handleSearch}
                    >
                      <Input placeholder="กรอกชื่อสินค้า" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                    <Form.Item
                      label="ประเภท"
                      name="type_name"
                      onChange={handleSearch}
                    >
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
                    <Form.Item
                      label="ชนิด"
                      name="kind_name"
                      onChange={handleSearch}
                    >
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
                    <Form.Item
                      label="ยี่ห้อ"
                      name="brand_name"
                      onChange={handleSearch}
                    >
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
                    <Form.Item
                      label="แบบ"
                      name="car_model_name"
                      onChange={handleSearch}
                    >
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
                    <Form.Item
                      label="รุ่น"
                      name="model_name"
                      onChange={handleSearch}
                    >
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
                        ค้นหา
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        className="bn-action"
                        danger
                        icon={<ClearOutlined />}
                        onClick={() => handleClear()}
                      >
                        ล้าง
                      </Button>
                    </Flex>
                  </Col>
                </Row>
              </Form>
            </>
          ),
          showArrow: false,
        },
      ]}
    />
  );
  const column = accessColumn({ handleEdit, handleDelete, handleView });

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
        <Flex gap={4} justify="end">
          <Button
            size="small"
            className="bn-action bn-center bn-primary-outline justify-center"
            icon={<MdOutlineLibraryAdd style={{ fontSize: ".9rem" }} />}
            onClick={() => {
              hangleAdd();
            }}
          >
            เพิ่มสินค้า
          </Button>
        </Flex>
      </Col>
    </Flex>
  );
  return (
    <div className="item-access">
      <Space
        direction="vertical"
        size="middle"
        style={{ display: "flex", position: "relative" }}
      >
        <Card>
          {FormSearch}
          <br></br>
          <Row gutter={[8, 8]} className="m-0">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Table
                title={() => TitleTable}
                size="small"
                rowKey="stcode"
                columns={column}
                dataSource={accessData}
              />
            </Col>
          </Row>
        </Card>
      </Space>
    </div>
  );
};

export default ItemsAccess;
