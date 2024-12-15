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

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $rest_json = file_get_contents("php://input");
        $_POST = json_decode($rest_json, true);
        extract($_POST, EXTR_OVERWRITE, "_");

        foreach ($detail as $ind => $val) {
            $val = (object)$val;

            $strSQL = "SELECT qty FROM items_stock where stcode = :stcode ";
            $stmt5 = $conn->prepare($strSQL);
            if (!$stmt5) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt5->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);

            if (!$stmt5->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }

            $res = $stmt5->fetch(PDO::FETCH_ASSOC);
            extract($res, EXTR_OVERWRITE, "_");
            if ($qty < $val->qty) {
                $error = $conn->errorInfo();
                throw new PDOException("จำนวนสต๊อกเหลือไม่พอให้ตัดออก");
                die;
            }
        }

        // var_dump($_POST);
        $sql = "insert dnmaster (`dncode`, `dndate`, `cuscode`,`total_price`,`vat`,`grand_total_price`,`remark`,created_by,updated_by) 
        values (:dncode,:dndate,:cuscode,:total_price,:vat,:grand_total_price,:remark,:action_user,:action_user)";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $header = (object)$header;
        $stmt->bindParam(":dncode", $header->dncode, PDO::PARAM_STR);
        $stmt->bindParam(":dndate", $header->dndate, PDO::PARAM_STR);
        $stmt->bindParam(":cuscode", $header->cuscode, PDO::PARAM_STR);
        $stmt->bindParam(":total_price", $header->total_price, PDO::PARAM_STR);
        $stmt->bindParam(":vat", $header->vat, PDO::PARAM_STR);
        $stmt->bindParam(":grand_total_price", $header->grand_total_price, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_STR);

        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }
        
        update_dncode($conn);
        $code = $conn->lastInsertId();

        $sql = "insert into dndetail (dncode,socode,stcode,qty,price,unit,discount,cost)
        values (:dncode,:socode,:stcode,:qty,:price,:unit,:discount,:cost)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt->bindParam(":dncode", $header->dncode, PDO::PARAM_STR);
            $stmt->bindParam(":socode", $val->socode, PDO::PARAM_STR);
            $stmt->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);
            $stmt->bindParam(":qty", $val->qty, PDO::PARAM_INT);
            $stmt->bindParam(":price", $val->price, PDO::PARAM_STR);
            $stmt->bindParam(":unit", $val->unit, PDO::PARAM_STR);
            $stmt->bindParam(":discount", $val->discount, PDO::PARAM_INT);
            $stmt->bindParam(":cost", $val->cost, PDO::PARAM_STR);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
            }

            $sql2 = "UPDATE items_stock SET qty= qty-:qty,price= amtprice*qty ,updated_date = CURRENT_TIMESTAMP() where stcode =:stcode ";
            $stmt2 = $conn->prepare($sql2);
            if (!$stmt2) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            // $stmt2->bindParam(":price", $val->price, PDO::PARAM_STR);
            $stmt2->bindParam(":qty", $val->qty, PDO::PARAM_STR);
            // $stmt2->bindParam(":discount", $val->discount, PDO::PARAM_STR);
            $stmt2->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);

            if (!$stmt2->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }

            $sql = "update sodetail set delamount = delamount+:qty where socode = :socode and stcode = :stcode";

            $stmt3 = $conn->prepare($sql);
            if (!$stmt3) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt3->bindParam(":qty", $val->qty, PDO::PARAM_STR);
            $stmt3->bindParam(":socode", $val->socode, PDO::PARAM_STR);
            $stmt3->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);

            if (!$stmt3->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }

            $strSQL = "SELECT count(code) as count FROM `sodetail` where socode = :socode and qty>IF(delamount IS NULL,0,delamount) ";
            $stmt5 = $conn->prepare($strSQL);
            if (!$stmt5) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt5->bindParam(":socode", $val->socode, PDO::PARAM_STR);

            if (!$stmt5->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }

            $res = $stmt5->fetch(PDO::FETCH_ASSOC);
            extract($res, EXTR_OVERWRITE, "_");
            if ($count == 0) {

                $sql = "
                update somaster 
                set
                doc_status = 'รอออกใบเสร็จรับเงิน',
                updated_date = CURRENT_TIMESTAMP(),
                updated_by = :action_user
                where socode = :socode";
            } else {
                $sql = "
                update somaster 
                set
                doc_status = 'รอออกใบส่งของ',
                updated_date = CURRENT_TIMESTAMP(),
                updated_by = :action_user
                where socode = :socode";
            }

            $stmt4 = $conn->prepare($sql);
            if (!$stmt4) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt4->bindParam(":action_user", $action_user, PDO::PARAM_INT);
            $stmt4->bindParam(":socode", $val->socode, PDO::PARAM_STR);

            if (!$stmt4->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data" => array("code" => $code)));
    } else  if ($_SERVER["REQUEST_METHOD"] == "PUT") {
        $rest_json = file_get_contents("php://input");
        $_PUT = json_decode($rest_json, true);
        extract($_PUT, EXTR_OVERWRITE, "_");
        // var_dump($_POST);
        $sql = "
        update dnmaster 
        set
        cuscode = :cuscode,
        dndate = :dndate,
        socode = :socode,
        remark = :remark,
        total_price = :total_price,
        vat = :vat,
        grand_total_price = :grand_total_price,
        updated_date = CURRENT_TIMESTAMP(),
        updated_by = :action_user
        where dncode = :dncode";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $header = (object)$header;

        $stmt->bindParam(":cuscode", $header->cuscode, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR);
        $stmt->bindParam(":total_price", $header->total_price, PDO::PARAM_STR);
        $stmt->bindParam(":vat", $header->vat, PDO::PARAM_STR);
        $stmt->bindParam(":grand_total_price", $header->grand_total_price, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);
        $stmt->bindParam(":dncode", $header->dncode, PDO::PARAM_STR);
        $stmt->bindParam(":socode", $header->socode, PDO::PARAM_STR);
        $stmt->bindParam(":dndate", $header->dndate, PDO::PARAM_STR);
        $stmt->bindParam(":dncode", $header->dncode, PDO::PARAM_STR);

        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $sql = "delete from dndetail where dncode = :dncode";
        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['dncode' => $header->dncode])) {
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $sql = "insert into dndetail (dncode,socode,stcode,qty,price,unit,discount,cost)
        values (:dncode,:socode,:stcode,:qty,:price,:unit,:discount,:cost)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt->bindParam(":dncode", $header->dncode, PDO::PARAM_STR);
            $stmt->bindParam(":socode", $val->socode, PDO::PARAM_STR);
            $stmt->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);
            $stmt->bindParam(":qty", $val->qty, PDO::PARAM_INT);
            $stmt->bindParam(":price", $val->price, PDO::PARAM_STR);
            $stmt->bindParam(":unit", $val->unit, PDO::PARAM_STR);
            $stmt->bindParam(":discount", $val->discount, PDO::PARAM_INT);
            $stmt->bindParam(":cost", $val->cost, PDO::PARAM_STR);
        
            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
            }
            
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data" => array("code" => $code)));
    } else  if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
        // $code = $_DELETE["code"];
        $code = $_GET["code"];

        $strSQL = "SELECT socode FROM dndetail where dncode = :code ";
        $stmt5 = $conn->prepare($strSQL);
        if (!$stmt5) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $stmt5->bindParam(":code", $code, PDO::PARAM_STR);

            if (!$stmt5->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }            

            $res = $stmt5->fetchAll(PDO::FETCH_ASSOC);

            foreach ($res as $row) {

                $sql = "update somaster set doc_status = 'รอออกใบส่งของ' where socode = :code";
                $stmt2 = $conn->prepare($sql);
                if (!$stmt2->execute(['code' => $row['socode']])) {
                    $error = $conn->errorInfo();
                    throw new PDOException("Remove data error => $error");
                }

                $sql = "update sodetail set delamount = 0 where socode = :code";
                $stmt2 = $conn->prepare($sql);
                if (!$stmt2->execute(['code' => $row['socode']])) {
                    $error = $conn->errorInfo();
                    throw new PDOException("Remove data error => $error");
                }

            }
       
        
        $sql = "update dnmaster set doc_status = 'ยกเลิก' where dncode = :code";
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'code' => $code ])){
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }       

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("status"=> 1));
    } else  if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $code = $_GET["code"];
        $sql = "SELECT a.dncode,a.cuscode,a.dndate,a.remark,c.prename,c.cusname,a.vat,a.doc_status
        ,CONCAT(COALESCE(c.idno, '') ,' ', COALESCE(c.road, ''),' ', COALESCE(c.subdistrict, ''),' ', COALESCE(c.district, ''),' ',COALESCE(c.zipcode, '') ) as address";
        $sql .= " FROM `dnmaster` as a ";
        $sql .= " inner join `customer` as c on (a.cuscode)=(c.cuscode)";
        $sql .= " where a.dncode = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $header = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT a.code,a.dncode,a.stcode,a.socode, a.price, a.unit, a.qty ,i.stname,a.discount,s.delamount, k.kind_name ";
        $sql .= " FROM `dndetail` as a";
        $sql .= " inner join `items` as i on (a.stcode=i.stcode)  ";
        $sql .= " left outer join `sodetail` as s on (a.stcode=s.stcode) and a.socode=s.socode  ";
        $sql .= " left outer join kind k on (i.kind_code=k.kind_code)  ";
        $sql .= " where a.dncode = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $dataArray = array();
        //$dataFile = array();
        foreach ($data as $row) {
            $nestedObject = new stdClass();
            $nestedObject->code = $row['code'];
            $nestedObject->stcode = $row['stcode'];
            $nestedObject->stname = $row['stname'];
            $nestedObject->price = $row['price'];
            $nestedObject->unit = $row['unit'];
            $nestedObject->qty = $row['qty']; 
            $nestedObject->discount = $row['discount'];     
            $nestedObject->socode = $row['socode'];    
            $nestedObject->delamount = $row['delamount']; 
            $nestedObject->kind_name = $row['kind_name']; 
            $nestedObject->cost = $row['cost']; 
                
            //echo $row['prod_id'];
            $stmt2 = $conn->prepare("SELECT * FROM `items_img` where stcode = '" . $row['stcode'] . "'");
            $stmt2->execute();
            if ($stmt2->rowCount() > 0) {
                $dataFile = array();
                while ($row2 = $stmt2->fetch(PDO::FETCH_ASSOC)) {
                    // $dataFile[] = $row2['file_name'];
                    $nestedObject->img_id = $row2['img_id'];
                    $nestedObject->uid = $row2['uid'];
                    // $nestedObject->name = $row2['name'];
                    $nestedObject->file_name = $row2['file_name'];
                }
            } else {
                $nestedObject->file = [];
                $nestedObject->file_name = null;
            }
            $dataArray[] = $nestedObject;
        }

        $apiResponse = array(
            "status" => "1",
            "message" => "Get Product",
            "header" => $header,
            "detail" => $dataArray,
            // "sql" => $sql,
            
        );

        $conn->commit();
        http_response_code(200);
        echo json_encode($apiResponse);
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
