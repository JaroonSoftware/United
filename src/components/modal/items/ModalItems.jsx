/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Modal, Card, Table, message, Form, Spin, Select } from "antd";
import { Row, Col, Space } from "antd";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { columns } from "./modal-items.model";
// import ItemService from "../../service/ItemService";
import OptionService from "../../../service/Options.service";

const opService = OptionService();
export default function ModalItems({ show, close, values, selected }) {
  const [form] = Form.useForm();
  /** handle state */
  const [itemsData, setItemsData] = useState([]);
  const [itemsDataWrap, setItemsDataWrap] = useState([]);

  const [itemsList, setItemsList] = useState(selected || []);
  const [itemsRowKeySelect, setItemsRowKeySelect] = useState([]);
  const [loading, setLoading] = useState(true);

  const [optionType, setOptionType] = useState([]);
  const [optionKind, setOptionKind] = useState([]);
  const [optionBrand, setOptionBrand] = useState([]);
  const [optionCarmodel, setOptionCarmodel] = useState([]);
  const [optionsModel, setOptionModel] = useState([]);

  /** handle logic component */
  const handleClose = () => {
    close(false);
  };

  // const handleSearch = (value) => {
  //     if(!!value){
  //         const f = itemsData.filter( d => ( (d.stcode?.includes(value)) || (d.stname?.includes(value)) ) );

  //         setItemsDataWrap(f);
  //     } else {
  //         setItemsDataWrap(itemsData);
  //     }

  // }

  const handleSearch = () => {
    form
      .validateFields()
      .then((v) => {
        const data = { ...v };
        // if (!!data?.sodate) {
        //   const arr = data?.sodate.map((m) => dayjs(m).format("YYYY-MM-DD"));
        //   const [sodate_form, sodate_to] = arr;
        //   //data.created_date = arr
        //   Object.assign(data, { sodate_form, sodate_to });
        // }

        setTimeout(() => getData(data), 80);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  const getData = (data) => {
    setLoading(true);
    let dataSource = { p: "items",...data}
    opService
      .optionsItems(dataSource)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setItemsData(data.data);
          setItemsDataWrap(data.data);

          const keySeleted = selected.map((m) => m.stcode);

          setItemsRowKeySelect([...keySeleted]);
          // console.log(selected);
          setLoading(false);
        }
      })
      .catch((err) => {
        message.error("Request error!");
      })
      .finally(() =>
        setTimeout(() => {
          setLoading(false);
        }, 400)
      );
  };

  const handleSelectItems = (record) => {
    const newData = {
      ...record,
      qty: 1,
      percent: 0,
      totalpercent: 0,
    };
    // console.log(newData);

    setItemsList([...itemsList, newData]);
  };

  const handleCheckDuplicate = (itemCode) =>
    !!selected.find((item) => item?.stcode === itemCode);

  const handleConfirm = () => {
    const choosed = selected.map((m) => m.stcode);
    const itemsChoose = itemsData
      .filter(
        (f) =>
          itemsRowKeySelect.includes(f.stcode) && !choosed.includes(f.stcode)
      )
      .map((m, i) => ({
        stcode: m.stcode,
        stname: m.stname,
        kind_name: m.kind_name,
        price: Number(m?.price || 0),
        qty: 1,
        unit: m.unit,
        discount: 0,
      }));

    // const trans = selected.filter( (item) =>  item?.stcode === "" );
    // const rawdt = selected.filter( (item) =>  item?.stcode !== "" );
    // console.log(itemsChoose, rawdt, trans);

    values([...selected, ...itemsChoose]);

    setItemsList([]);
    close(false);
  };

  /** Config Conponent */

  const itemSelection = {
    selectedRowKeys: itemsRowKeySelect,
    type: "checkbox",
    fixed: true,
    hideSelectAll: true,
    onChange: (selectedRowKeys, selectedRows) => {
      // setItemsRowKeySelect([...new Set([...selectedRowKeys, ...itemsRowKeySelect])]);
      // setItemsList(selectedRows);
      //setItemsRowKeySelect(selectedRowKeys);
    },
    getCheckboxProps: (record) => {
      return {
        disabled: handleCheckDuplicate(record.stcode),
        name: record.stcode,
      };
    },
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      //console.log(record, selected, selectedRows, nativeEvent);
      if (selected) {
        setItemsRowKeySelect([
          ...new Set([...itemsRowKeySelect, record.stcode]),
        ]);
      } else {
        const ind = itemsRowKeySelect.findIndex((d) => d === record.stcode);
        const tval = [...itemsRowKeySelect];
        tval.splice(ind, 1);
        setItemsRowKeySelect([...tval]);
        //console.log(ind, itemsRowKeySelect);
      }
    },
  };

  /** End Config Component */

  /** setting initial component */
  const column = columns({ handleSelectItems, handleCheckDuplicate });

  //   useEffect(() => {
  //     const onload = () => {
  //       setLoading(true);
  //       opService
  //         .optionsItems({ p: "items" })
  //         .then((res) => {
  //           let { status, data } = res;
  //           if (status === 200) {
  //             setItemsData(data.data);
  //             setItemsDataWrap(data.data);

  //             const keySeleted = selected.map((m) => m.stcode);

  //             setItemsRowKeySelect([...keySeleted]);
  //             // console.log(selected);
  //           }
  //         })
  //         .catch((err) => {
  //           message.error("Request error!");
  //         })
  //         .finally(() =>
  //           setTimeout(() => {
  //             setLoading(false);
  //           }, 400)
  //         );
  //     };
  //     if (!!show) {
  //       onload();
  //       // console.log("modal-select-items");
  //     }
  //   }, [selected, show]);

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
  }, [selected, show]);

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

  /** setting child component */
  const ButtonModal = (
    <Space direction="horizontal" size="middle">
      <Button onClick={() => handleClose()}>ปิด</Button>
      <Button type="primary" onClick={() => handleConfirm()}>
        ยืนยันการเลือกสินค้า
      </Button>
    </Space>
  );
  /** */
  return (
    <>
      <Modal
        open={show}
        title="เลือกสินค้า"
        onCancel={() => handleClose()}
        footer={ButtonModal}
        maskClosable={false}
        style={{ top: 20 }}
        width={1400}
        className="sample-request-modal-items"
      >
        <Spin spinning={loading}>
          <Space
            direction="vertical"
            size="middle"
            style={{ display: "flex", position: "relative" }}
          >
            <Card style={{ backgroundColor: "#f0f0f0" }}>
              <Form form={form} layout="vertical" autoComplete="off">
                <Row
                  gutter={[{ xs: 32, sm: 32, md: 32, lg: 12, xl: 12 }, 8]}
                  className="m-0"
                >
                  <Col span={12}>
                    <Form.Item label="ค้นหา">
                      <Input
                        suffix={<SearchOutlined />}
                        onChange={(e) => {
                          handleSearch(e.target.value);
                        }}
                        placeholder="ค้นหาชื่อ หรือ รหัสสินค้า"
                      />
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
              </Form>
            </Card>
            <Card>
              <Table
                bordered
                dataSource={itemsDataWrap}
                columns={column}
                rowSelection={itemSelection}
                rowKey="stcode"
                pagination={{
                  total: itemsDataWrap.length,
                  showTotal: (_, range) =>
                    `${range[0]}-${range[1]} of ${itemsData.length} items`,
                  defaultPageSize: 8,
                  pageSizeOptions: [8, 25, 35, 50, 100],
                }}
                scroll={{ x: "max-content" }}
                size="small"
              />
            </Card>
          </Space>
        </Spin>
      </Modal>
    </>
  );
}
