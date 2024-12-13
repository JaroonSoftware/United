import React from 'react'
import { Tag } from "antd"
import { CheckCircleFilled, ClockCircleFilled } from "@ant-design/icons"
import { CloseCircleFilledIcon } from '../../icon';


function TagReceiptStatus({result}) {
  let elementToRender;

  switch (result) {
    case 'ออกใบวางบิลแล้ว':
      elementToRender = <Tag icon={<CheckCircleFilled />} color="#87d068"> ออกใบวางบิลแล้ว </Tag>;
      break;
    case 'รอออกใบวางบิล':
      elementToRender = <Tag icon={<ClockCircleFilled />} color="#347C98"> รอออกใบวางบิล </Tag>;
      break;
    case 'ยกเลิก':
      elementToRender = <Tag icon={<CloseCircleFilledIcon />} color="#ababab"> ยกเลิก </Tag>;
      break;
    default:
      elementToRender = <Tag > Not found </Tag>;
  }
  return <>{elementToRender}</>
}

export default TagReceiptStatus