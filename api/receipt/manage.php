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

        // var_dump($_POST);
        $sql = "insert receipt (`recode`, `redate`, `duedate`, `cuscode`,
       `total_price`, `vat`, `grand_total_price`,`remark`,created_by,updated_by) 
        values (:recode,:redate,:duedate,:cuscode,:total_price,:vat,:grand_total_price,   :remark,:action_user,:action_user)";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $header = (object)$header;
        $stmt->bindParam(":recode", $header->recode, PDO::PARAM_STR);
        $stmt->bindParam(":redate", $header->redate, PDO::PARAM_STR);
        $stmt->bindParam(":duedate", $header->duedate, PDO::PARAM_STR);
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

        update_recode($conn);

        $code = $conn->lastInsertId();
        // var_dump($master); exit;

        $sql = "insert into receipt_detail (recode,dncode,stcode,qty,price,unit,discount)
        values (:recode,:dncode,:stcode,:qty,:price,:unit,:discount)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt->bindParam(":recode", $header->recode, PDO::PARAM_STR);
            $stmt->bindParam(":dncode", $val->dncode, PDO::PARAM_STR);
            $stmt->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);
            $stmt->bindParam(":qty", $val->qty, PDO::PARAM_INT);
            $stmt->bindParam(":price", $val->price, PDO::PARAM_INT);
            $stmt->bindParam(":unit", $val->unit, PDO::PARAM_STR);
            $stmt->bindParam(":discount", $val->discount, PDO::PARAM_INT);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
            }

            $sql = "
            update dnmaster 
            set
            doc_status = 'ออกใบเสร็จรับเงินแล้ว',
            updated_date = CURRENT_TIMESTAMP(),
            updated_by = :action_user
            where dncode = :dncode";

            $stmt1 = $conn->prepare($sql);
            if (!$stmt1) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt1->bindParam(":action_user", $action_user, PDO::PARAM_INT);
            $stmt1->bindParam(":dncode", $val->dncode, PDO::PARAM_STR);

            if (!$stmt1->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }

            $strSQL = "SELECT socode FROM dndetail where dncode = :code ";
            $stmt5 = $conn->prepare($strSQL);
            if (!$stmt5) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt5->bindParam(":code", $val->dncode, PDO::PARAM_STR);

            if (!$stmt5->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }

            $res = $stmt5->fetchAll(PDO::FETCH_ASSOC);

            foreach ($res as $row) {

                $sql = "update somaster set doc_status = 'รอออกใบวางบิล' where socode = :code";
                $stmt2 = $conn->prepare($sql);
                if (!$stmt2->execute(['code' => $row['socode']])) {
                    $error = $conn->errorInfo();
                    throw new PDOException("Remove data error => $error");
                }
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
        update receipt 
        set
        redate = :redate,
        duedate = :duedate,
        cuscode = :cuscode,
        total_price = :total_price,
        vat = :vat,
        grand_total_price = :grand_total_price,
        remark = :remark,
        updated_date = CURRENT_TIMESTAMP(),
        updated_by = :action_user
        where recode = :recode";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $header = (object)$header;

        $stmt->bindParam(":cuscode", $header->cuscode, PDO::PARAM_STR);
        $stmt->bindParam(":total_price", $header->total_price, PDO::PARAM_STR);
        $stmt->bindParam(":vat", $header->vat, PDO::PARAM_STR);
        $stmt->bindParam(":grand_total_price", $header->grand_total_price, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);
        $stmt->bindParam(":redate", $header->redate, PDO::PARAM_STR);
        $stmt->bindParam(":duedate", $header->duedate, PDO::PARAM_STR);
        $stmt->bindParam(":recode", $header->recode, PDO::PARAM_STR);

        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $sql = "delete from receipt_detail where recode = :recode";
        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['recode' => $header->recode])) {
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $sql = "insert into receipt_detail (recode,stcode,dncode,unit,qty,price,discount)
        values (:recode,:stcode,:dncode,:unit,:qty,:price,:discount)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt->bindParam(":recode", $header->recode, PDO::PARAM_STR);
            $stmt->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);
            $stmt->bindParam(":dncode", $val->dncode, PDO::PARAM_STR);
            $stmt->bindParam(":unit", $val->unit, PDO::PARAM_STR);
            $stmt->bindParam(":qty", $val->qty, PDO::PARAM_INT);
            $stmt->bindParam(":price", $val->price, PDO::PARAM_INT);
            $stmt->bindParam(":discount", $val->discount, PDO::PARAM_INT);
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

        $strSQL = "SELECT dncode FROM receipt_detail where recode = :code ";
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

            $sql = "update dnmaster set doc_status = 'รอออกใบเสร็จรับเงิน' where dncode = :code";
            $stmt2 = $conn->prepare($sql);
            if (!$stmt2->execute(['code' => $row['dncode']])) {
                $error = $conn->errorInfo();
                throw new PDOException("Remove data error => $error");
            }

            $strSQL = "SELECT socode FROM dndetail where dncode = :code ";
            $stmt5 = $conn->prepare($strSQL);
            if (!$stmt5) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt5->bindParam(":code", $row['dncode'], PDO::PARAM_STR);

            if (!$stmt5->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }

            $res = $stmt5->fetchAll(PDO::FETCH_ASSOC);

            foreach ($res as $row) {

                $sql = "update somaster set doc_status = 'รอออกใบเสร็จรับเงิน' where socode = :code";
                $stmt2 = $conn->prepare($sql);
                if (!$stmt2->execute(['code' => $row['socode']])) {
                    $error = $conn->errorInfo();
                    throw new PDOException("Remove data error => $error");
                }
            }
        }


        $sql = "update receipt set doc_status = 'ยกเลิก' where recode = :code";
        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("status" => 1));
    } else  if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $code = $_GET["code"];
        $sql = "SELECT a.recode,a.redate,a.duedate,a.cuscode,c.prename,c.cusname,CONCAT(c.idno ,' ', c.road,' ', c.subdistrict,' ', c.district,' ', c.zipcode) as address
        ,c.zipcode,c.contact,c.tel,c.fax,a.total_price,a.vat,a.grand_total_price,a.remark,a.doc_status ";
        $sql .= " FROM `receipt` as a ";
        $sql .= " inner join `customer` as c on (a.cuscode)=(c.cuscode)";
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
