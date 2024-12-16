/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import { Modal, Card, Table, message, Form, Spin } from "antd";
import { Row, Col, Space } from "antd";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons"

import { columns } from "./model"; 
// import ItemService from "../../service/ItemService";
import OptionService from "../../../service/Options.service"

const opnService = OptionService();
export default function ModalDN({show, close,cuscode, values, selected}) {
    const [form] = Form.useForm();
    /** handle state */
    const [soData, setSOData] = useState([]);
    const [soDataWrap, setSODataWrap] = useState([]);
    
    const [itemsList, setItemsList] = useState(selected || []);
    const [itemsRowKeySelect, setItemsRowKeySelect] = useState([]);
    const [loading,  setLoading] = useState(true);
    /** handle logic component */
    const handleClose = () =>{ 
        close(false);
    }
 
    const handleSearch = (value) => {
        if(!!value){    
            const f = soData.filter( d => ( (d.stcode?.includes(value)) || (d.dncode?.includes(value)) ) );
             
            setSODataWrap(f);            
        } else { 
            setSODataWrap(soData);            
        }

    }

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

    const handleCheckDuplicate = (itemCode) => !!selected.find( (item) =>  item?.dncode === itemCode ) ; 

    const handleConfirm = () => { 
        const choosed = selected.map( m => m.dncode );
        const itemsChoose = (soData.filter( f => itemsRowKeySelect.includes(f.dncode) && !choosed.includes(f.dncode) )).map( (m, i) => (
        {
            dncode:m.dncode,
        }));
        
        // const trans = selected.filter( (item) =>  item?.socode === "" );
        // const rawdt = selected.filter( (item) =>  item?.socode !== "" );
        // console.log(itemsChoose, rawdt, trans); 

        values([...selected, ...itemsChoose]);
        
        setItemsList([]);
        close(false);
    }

    /** Config Conponent */

    const itemSelection = {
        selectedRowKeys : itemsRowKeySelect,
        type: "checkbox",
        fixed: true,
        hideSelectAll:true,
        onChange: (selectedRowKeys, selectedRows) => { 
            // setItemsRowKeySelect([...new Set([...selectedRowKeys, ...itemsRowKeySelect])]);
            // setItemsList(selectedRows);
            //setItemsRowKeySelect(selectedRowKeys);
        },
        getCheckboxProps: (record) => { 
            return {
                disabled: handleCheckDuplicate(record.dncode), 
                name: record.dncode,
            }
        },
        onSelect: (record, selected, selectedRows, nativeEvent) => {
            //console.log(record, selected, selectedRows, nativeEvent);
            if( selected ){
                setItemsRowKeySelect([...new Set([...itemsRowKeySelect, record.dncode])]);
            } else {
                const ind = itemsRowKeySelect.findIndex( d => d === record.dncode);
                const tval = [...itemsRowKeySelect];
                tval.splice(ind, 1);
                setItemsRowKeySelect([...tval]);
                //console.log(ind, itemsRowKeySelect);
            }
        }
    };

    /** End Config Component */

    /** setting initial component */ 
    const column = columns( { handleSelectItems, handleCheckDuplicate } );

    useEffect( () => {
        const onload = () =>{
            setLoading(true);
            opnService.optionsDN({cuscode:cuscode}).then((res) => {
                let { status, data } = res;
                if (status === 200) {
                    setSOData(data.data);
                    setSODataWrap(data.data);

                    const keySeleted = selected.map( m => m.dncode );

                    setItemsRowKeySelect([...keySeleted]);
                    // console.log(selected);

                }
            })
            .catch((err) => { 
                message.error("Request error!");
            })
            .finally( () => setTimeout( () => { setLoading(false) }, 400));
        }

        if( !!show ){
            onload();
            // console.log("modal-select-items");          
        } 
    }, [selected,show]);

    /** setting child component */
    const ButtonModal = (
        <Space direction="horizontal" size="middle" >
            
            <Button onClick={() => handleClose() }>ปิด</Button>
            <Button type='primary' onClick={() => handleConfirm() }>ยืนยันการเลือกใบส่งสินค้า</Button>
        </Space>
    )
    /** */
    return (
        <>
        <Modal
            open={show}
            title="เลือกใบส่งสินค้า"
            onCancel={() => handleClose() } 
            footer={ButtonModal}
            maskClosable={false}
            style={{ top: 20 }}
            width={1200}
            className='sample-request-modal-items'
        >
            <Spin spinning={loading} >
                <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative'}}  >
                    <Card style={{backgroundColor:'#f0f0f0' }}>
                        <Form form={form} layout="vertical" autoComplete="off" >
                            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                                <Col span={24}>
                                    <Form.Item label="ค้นหา"  >
                                        <Input suffix={<SearchOutlined />} onChange={ (e) => { handleSearch(e.target.value) } } placeholder='ค้นหาชื่อ หรือ รหัสใบส่งสินค้า'/>
                                    </Form.Item>                        
                                </Col> 
                            </Row> 
                        </Form>
                    </Card>
                    <Card>
                        <Table  
                            bordered
                            dataSource={soDataWrap}
                            columns={column} 
                            rowSelection={itemSelection}
                            rowKey="dncode"
                            pagination={{ 
                                total:soDataWrap.length, 
                                showTotal:(_, range) => `${range[0]}-${range[1]} of ${soData.length} items`,
                                defaultPageSize:10,
                                pageSizeOptions:[10,25,35,50,100]
                            }}
                            scroll={{ x: 'max-content' }} size='small'
                        /> 
                    </Card>
                </Space>                
            </Spin> 
        </Modal>    
        </>
    )
}