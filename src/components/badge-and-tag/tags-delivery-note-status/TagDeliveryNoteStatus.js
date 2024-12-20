import React from 'react'
import { Tag } from "antd"
import { CheckCircleFilled, ClockCircleFilled } from "@ant-design/icons"
import { CloseCircleFilledIcon } from '../../icon';


export default function TagDeliveryNoteStatus({result}) {
  let elementToRender;

  switch (result) {
    case 'ออกใบเสร็จรับเงินแล้ว':
      elementToRender = <Tag icon={<CheckCircleFilled />} color="#87d068"> ออกใบเสร็จรับเงินแล้ว </Tag>;
      break;
    case 'รอออกใบเสร็จรับเงิน':
      elementToRender = <Tag icon={<ClockCircleFilled />} color="#347C98"> รอออกใบเสร็จรับเงิน</Tag>;
      break;
    case 'ยกเลิก':
      elementToRender = <Tag icon={<CloseCircleFilledIcon />} color="#ababab"> ยกเลิก </Tag>;
      break;
    default:
      elementToRender = <Tag > Not found </Tag>;
  }
  return <>{elementToRender}</>
}