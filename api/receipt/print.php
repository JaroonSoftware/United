<?php
ob_start();
include_once(dirname(__FILE__, 2) . "/onload.php");
include_once(dirname(__FILE__, 2) . "/common/fnc-code.php");

$db = new DbConnect;
$conn = $db->connect();
$conn->beginTransaction();
http_response_code(400);
try {
    $action_date = date("Y-m-d H:i:s");
    $action_user = $token->userid;
    // echo $action_user;

    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $code = $_GET["code"];
        $sql = "SELECT a.recode,a.redate,x.socode,x.delcode,a.cuscode,x.claim_no,x.require_no,x.car_engineno,x.car_model_code,x.car_no,c.prename,c.cusname,CONCAT(COALESCE(c.idno, '') ,' ', COALESCE(c.road, ''),' ', COALESCE(c.subdistrict, ''),' ', COALESCE(c.district, ''),' ',COALESCE(c.zipcode, '') ) as address
        ,c.zipcode,c.contact,c.tel,c.fax,c.contact,c.tel,CONCAT(COALESCE(d.idno, '') ,' ', COALESCE(d.road, ''),' ', COALESCE(d.subdistrict, ''),' ', COALESCE(d.district, ''),' ',COALESCE(d.zipcode, '') )  as deladdress
        ,d.contact as delcontact,d.tel as deltel,a.total_price,a.vat,a.grand_total_price,a.remark,CONCAT(d.prename,' ',d.cusname) as delname,
        CONCAT(d.tel) as deltel,a.doc_status ,m.car_model_code,m.brand_code,m.model_code,m.year,m.car_model_name,m.model_code,m.brand_code,k.model_name,j.brand_name";
        $sql .= " FROM `receipt` as a ";
        $sql .= " left outer join `somaster` as x on (a.cuscode)=(x.cuscode)";
        // $sql .= " left outer join `sodetail` as s on (x.cuscode=s.cuscode) ";
        $sql .= " left outer join `customer` as c on (x.cuscode)=(c.cuscode)";
        $sql .= " left outer join `customer` as d on (x.delcode)=(d.cuscode)";
        $sql .= " left outer join `car_model` as m on (x.car_model_code)=(m.car_model_code)";
        $sql .= " left outer join `model_table` as k on (m.model_code)=(k.model_code)";
        $sql .= " left outer join `brand` as j on (m.brand_code)=(j.brand_code)";
        // $sql .= " left outer join `brand` as b on (b.brand_code)=(m.brand_code)";
        // $sql .= " left outer join `model_table` as mo on (mo.model_code)=(m.model_code)";
        $sql .= " where a.recode = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $header = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT a.recode,a.stcode,a.dncode, a.price, a.discount, a.unit, a.qty ,i.stname,k.kind_name ";
        $sql .= " FROM `receipt_detail` as a inner join `items` as i on (a.stcode=i.stcode)  ";
        $sql .= " left outer join kind k on (i.kind_code=k.kind_code)  ";
        $sql .= " where a.recode = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $detail = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $conn->commit();
        http_response_code(200);
        echo json_encode(array('status' => 1, 'data' => array("header" => $header, "detail" => $detail)));
    }
} catch (PDOException $e) {
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} finally {
    $conn = null;
}
ob_end_flush();
exit;
