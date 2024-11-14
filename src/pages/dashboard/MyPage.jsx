/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Flex,
  Row,
  Space,
  Table,
  Typography,
  Form,
  Input,
  Button,
  Collapse,
} from "antd";
import {
  minstockColumn,
} from "./model";

import { SearchOutlined, ClearOutlined } from "@ant-design/icons";

import DashBoardService from "../../service/DashBoard.service";

const pagging = { pagination: { current: 1, pageSize: 10 } };
const dsbservice = DashBoardService();

function DashBoard() {
  const [mounted, setMounted] = useState(false);
  const [sampleListloading, setSampleListLoading] = useState(false);
  const [sampleListParams, setSampleListParams] = useState({ ...pagging });

  const [form] = Form.useForm();
  const [accessData, setAccessData] = useState([]);
  const [activeSearch, setActiveSearch] = useState([]);

  //   const showSrDetail = (value) => {
  //     const { srcode } = value;

  //     // fetchSampleDetailData(false);
  //   };


  const CardMinStock = () => {
    return (
      <>
        <Card
          className="w-full"
          style={{ borderRadius: "2rem", height: "100%" }}
          title={
            <Typography.Title
              level={4}
              className="m-0 font-semibold !text-slate-700 uppercase"
            >
              รายงานสินค้าเหลือน้อย
            </Typography.Title>
          }
        >
          <Table
            bordered={false}
            size="small"
            columns={minstockColumn({ handleShowDetail: "" })}
            dataSource={accessData}
            rowKey="stcode"
            loading={sampleListloading}
            scroll={{ x: "max-content" }}
          />
          {/* <Table
                size="small"
                rowKey="stcode"
                columns={column}
                dataSource={accessData}
              /> */}
        </Card>
      </>
    );
  };

  const fetchMinStockData = async (load = false) => {
    setSampleListLoading(true && load);

    const source = { ...form.getFieldsValue(), ...sampleListParams };
    const res = await dsbservice.minstock({ ...source });
    // const  [source]  = res.data;
    const { data } = res.data;
    // console.log(data)
    setAccessData(data);
    setSampleListLoading(false && load);
    setSampleListParams((state) => ({ ...state }));
  };

  useEffect(() => {
    if (mounted) fetchMinStockData(true);
  }, [JSON.stringify(sampleListParams)]);

  // useEffect(() => {
  //   if( mounted ) fetchSampleWaitingApproveData( true );
  // }, [JSON.stringify(sampleWaitingApproveParams)]);

  // useEffect(() => {
  //   if( mounted ) fetchSampleDetailData( false );
  // }, [JSON.stringify(sampleDetailParams)]);

  // useEffect(() => {
  //   if( mounted ) fetchFilesExpireData( true );
  // }, [JSON.stringify(filesExpireParams)]);

  useEffect(() => {
    const initeial = async () => {
      await Promise.all([
        fetchMinStockData(false),
        // fetchSampleWaitingApproveData( false ),
        // fetchFilesExpireData( false ),
        // fetchStatisticData(),
      ]);

      setTimeout(() => setMounted(true), 400);
    };

    if (!mounted) initeial();
  }, []);

  const handleSearch = () => {
    fetchMinStockData();
  };

  const handleClear = () => {
    form.resetFields();

    handleSearch();
  };

  const CollapseItemSearch = (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="รหัสสินค้า" name="stcode">
            <Input placeholder="Enter Product Code." />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="ชื่อสินค้า" name="stname">
            <Input placeholder="Enter Product Name." />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="รหัสผู้ขาย" name="supcode">
            <Input placeholder="Enter Supplier Code." />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Form.Item label="ชื่อผู้ขาย" name="supname">
            <Input placeholder="Enter Supplier Name." />
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
              <span> ค้นหา</span>
            </>
          ),
          children: <>{CollapseItemSearch}</>,
          showArrow: false,
        },
      ]}
      // bordered={false}
    />
  );

  return (
    <>
      <div className="layout-content px-3 sm:px-5 md:px-5">
        <Space
          direction="vertical"
          size="middle"
          style={{
            display: "flex",
            position: "relative",
            paddingInline: "1.34rem",
          }}
          className="dashboard"
          id="dashboard"
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
          {/* <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                        <div style={{height:'100%'}}> 
                            <CardStatistic bgColor="#8f8df9" title="Sample Daily" icon={<FiFileText />} value={statisticData.daily} />
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                        <div style={{height:'100%'}}>
                            <CardStatistic bgColor="#fe8992" title="Sample Monthly" icon={<FiFileText />} value={statisticData.monthly} />
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                        <div style={{height:'100%'}}>
                            <CardStatistic bgColor="#3987d3" title="Sample Yearly" icon={<FiFileText />} value={statisticData.yearly} />
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                        <div style={{height:'100%'}}>
                            <CardStatistic bgColor="#ffd19d" title="Sample Waiting Approve" icon={<LuFileClock />} value={statisticData.waiting} />
                        </div>
                    </Col>
                </Row> */}
          <Row gutter={[18, 12]} style={{ minHeight: 380 }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div style={{ height: "100%" }}>
                <CardMinStock />
              </div>
            </Col>
            {/* <Col xs={24} sm={12} md={12} lg={10} xl={10} >
                        <div style={{height:'100%'}}>
                            <CardSampleWaitingApprove /> 

                        </div>
                    </Col> */}
          </Row>
          {/* <Row gutter={[18, 12]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                        <CardFilesExpire />
                    </Col>
                </Row>  */}
        </Space>
      </div>
    </>
  );
}

export default DashBoard;
