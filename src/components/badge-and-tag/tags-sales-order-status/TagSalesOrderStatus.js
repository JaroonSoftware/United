import React from 'react'
import { Tag } from "antd"
import { CheckCircleFilled, ClockCircleFilled } from "@ant-design/icons"
import { CloseCircleFilledIcon } from '../../icon';


function TagSalesOrderStatus({ result }) {
  let elementToRender;

  switch (result) {
    case 'ชำระครบแล้ว':
      elementToRender = <Tag icon={<CheckCircleFilled />} color="#87d068"> ชำระครบแล้ว </Tag>;
      break;
    case 'รอชำระเงิน':
      elementToRender = <Tag icon={<ClockCircleFilled />} color="#ffab47"> รอชำระเงิน </Tag>;
      break;
    case 'รอออกใบส่งของ':
      elementToRender = <Tag icon={<ClockCircleFilled />} color="#347C98"> รอออกใบส่งของ </Tag>;
      break;
    case 'รอออกใบเสร็จรับเงิน':
      elementToRender = <Tag icon={<ClockCircleFilled />} color="#ffab47"> รอออกใบเสร็จรับเงิน </Tag>;
      break;
    case 'ยกเลิก':
      elementToRender = <Tag icon={<CloseCircleFilledIcon />} color="#ababab"> ยกเลิก </Tag>;
      break;
    default:
      elementToRender = <Tag > Not found </Tag>;
  }
  return <>{elementToRender}</>
}

export default TagSalesOrderStatus