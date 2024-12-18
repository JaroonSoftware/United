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
        $sql = "insert iv_master (`ivcode`, `ivdate`, `cuscode`,total_price,total_pay,`remark`,created_by,updated_by) 
        values (:ivcode,:ivdate,:cuscode,:total_price,:total_pay,
        :remark,:action_user,:action_user)";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $header = (object)$header;
        $stmt->bindParam(":ivcode", $header->ivcode, PDO::PARAM_STR);
        $stmt->bindParam(":ivdate", $header->ivdate, PDO::PARAM_STR);
        $stmt->bindParam(":cuscode", $header->cuscode, PDO::PARAM_STR);
        $stmt->bindParam(":total_price", $header->total_price, PDO::PARAM_STR);
        $stmt->bindParam(":total_pay", $header->total_pay, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_STR);

        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $sql = "
            update receipt 
            set
            doc_status = 'ออกใบวางบิลแล้ว',
            updated_date = CURRENT_TIMESTAMP(),
            updated_by = :action_user
            where recode = :recode";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);
        $stmt->bindParam(":recode", $header->recode, PDO::PARAM_STR);

        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        update_ivcode($conn);

        $total_price = $header->total_price;
        $total_pay = $header->total_pay;

        $sql = "insert into iv_detail (ivcode,recode)
        values (:ivcode,:recode)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt->bindParam(":ivcode", $header->ivcode, PDO::PARAM_STR);
            $stmt->bindParam(":recode", $val->recode, PDO::PARAM_STR);
            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
            }

            $sql = "
            update receipt 
            set
            doc_status = 'ออกใบวางบิลแล้ว',
            updated_date = CURRENT_TIMESTAMP(),
            updated_by = :action_user
            where recode = :recode";

            $stmt1 = $conn->prepare($sql);
            if (!$stmt1) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt1->bindParam(":action_user", $action_user, PDO::PARAM_INT);
            $stmt1->bindParam(":recode", $val->recode, PDO::PARAM_STR);

            if (!$stmt1->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }
        }

        $sql = "insert into iv_payment (ivcode,paydate,price,payment_type,bank,bank_name_th,bank_name,bank_no,remark)
        values (:ivcode,:paydate,:price,:payment_type,:bank,:bank_name_th,:bank_name,:bank_no,:remark)";
        $stmt2 = $conn->prepare($sql);
        if (!$stmt2) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  


        foreach ($payment as $ind => $pay) {
            $pay = (object)$pay;
            $stmt2->bindParam(":ivcode", $header->ivcode, PDO::PARAM_STR);
            $stmt2->bindParam(":paydate", $pay->paydate, PDO::PARAM_STR);
            $stmt2->bindParam(":price", $pay->price, PDO::PARAM_STR);
            $stmt2->bindParam(":payment_type", $pay->payment_type, PDO::PARAM_STR);
            $stmt2->bindParam(":bank", $pay->bank, PDO::PARAM_STR);
            $stmt2->bindParam(":bank_name_th", $pay->bank_name_th, PDO::PARAM_STR);
            $stmt2->bindParam(":bank_name", $pay->bank_name, PDO::PARAM_STR);
            $stmt2->bindParam(":bank_no", $pay->bank_no, PDO::PARAM_STR);
            $stmt2->bindParam(":remark", $pay->remark, PDO::PARAM_STR);
            if (!$stmt2->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
            }
        }



        if ($total_price == $total_pay) {
            $sql = "
            update iv_master 
            set
            doc_status = 'ชำระเงินครบแล้ว',
            updated_date = CURRENT_TIMESTAMP(),
            updated_by = :action_user
            where ivcode = :ivcode";

            $stmt = $conn->prepare($sql);
            if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);
            $stmt->bindParam(":ivcode", $header->ivcode, PDO::PARAM_STR);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }
        } else if ($total_pay == 0) {
            $sql = "
            update iv_master 
            set
            doc_status = 'รอชำระเงิน',
            updated_date = CURRENT_TIMESTAMP(),
            updated_by = :action_user
            where ivcode = :ivcode";

            $stmt = $conn->prepare($sql);
            if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);
            $stmt->bindParam(":ivcode", $header->ivcode, PDO::PARAM_STR);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }
        } else {
            $sql = "
            update iv_master 
            set
            doc_status = 'ชำระเงินยังไม่ครบ',
            updated_date = CURRENT_TIMESTAMP(),
            updated_by = :action_user
            where ivcode = :ivcode";

            $stmt = $conn->prepare($sql);
            if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);
            $stmt->bindParam(":ivcode", $header->ivcode, PDO::PARAM_STR);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data" => array("code" => $code, "total_pay" => $total_pay, "total_price" => $total_price)));
    } else  if ($_SERVER["REQUEST_METHOD"] == "PUT") {
        $rest_json = file_get_contents("php://input");
        $_PUT = json_decode($rest_json, true);
        extract($_PUT, EXTR_OVERWRITE, "_");
        // var_dump($_POST);

        $sql = "
        update iv_master 
        set
        ivdate = :ivdate,
        cuscode = :cuscode,
        total_price = :total_price,
        total_pay = :total_pay,
        remark = :remark,
        updated_date = CURRENT_TIMESTAMP(),
        updated_by = :action_user
        where ivcode = :ivcode";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $header = (object)$header;

        $stmt->bindParam(":ivdate", $header->ivdate, PDO::PARAM_STR);
        $stmt->bindParam(":cuscode", $header->cuscode, PDO::PARAM_STR);
        $stmt->bindParam(":total_price", $header->total_price, PDO::PARAM_STR);
        $stmt->bindParam(":total_pay", $header->total_pay, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);
        $stmt->bindParam(":ivcode", $header->ivcode, PDO::PARAM_STR);

        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $total_price = $header->total_price;
        $total_pay = $header->total_pay;

        $sql = "delete from iv_detail where ivcode = :ivcode";
        $stmt3 = $conn->prepare($sql);
        if (!$stmt3->execute(['ivcode' => $header->ivcode])) {
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $sql = "insert into iv_detail (ivcode,recode)
        values (:ivcode,:recode)";
        $stmt5 = $conn->prepare($sql);
        if (!$stmt5) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt5->bindParam(":ivcode", $header->ivcode, PDO::PARAM_STR);
            $stmt5->bindParam(":recode", $val->recode, PDO::PARAM_STR);
            if (!$stmt5->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
            }

            $sql = "
            update receipt 
            set
            doc_status = 'ออกใบวางบิลแล้ว',
            updated_date = CURRENT_TIMESTAMP(),
            updated_by = :action_user
            where recode = :recode";

            $stmt1 = $conn->prepare($sql);
            if (!$stmt1) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt1->bindParam(":action_user", $action_user, PDO::PARAM_INT);
            $stmt1->bindParam(":recode", $val->recode, PDO::PARAM_STR);

            if (!$stmt1->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }
        }

        $sql = "delete from iv_payment where ivcode = :ivcode";
        $stmt4 = $conn->prepare($sql);
        if (!$stmt4->execute(['ivcode' => $header->ivcode])) {
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $sql = "insert into iv_payment (ivcode,paydate,price,payment_type,bank,bank_name_th,bank_name,bank_no,remark)
        values (:ivcode,:paydate,:price,:payment_type,:bank,:bank_name_th,:bank_name,:bank_no,:remark)";
        $stmt2 = $conn->prepare($sql);
        if (!$stmt2) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($payment as $ind => $pay) {
            $pay = (object)$pay;
            $stmt2->bindParam(":ivcode", $header->ivcode, PDO::PARAM_STR);
            $stmt2->bindParam(":paydate", $pay->paydate, PDO::PARAM_STR);
            $stmt2->bindParam(":price", $pay->price, PDO::PARAM_STR);
            $stmt2->bindParam(":payment_type", $pay->payment_type, PDO::PARAM_STR);
            $stmt2->bindParam(":bank", $pay->bank, PDO::PARAM_STR);
            $stmt2->bindParam(":bank_name_th", $pay->bank_name_th, PDO::PARAM_STR);
            $stmt2->bindParam(":bank_name", $pay->bank_name, PDO::PARAM_STR);
            $stmt2->bindParam(":bank_no", $pay->bank_no, PDO::PARAM_STR);
            $stmt2->bindParam(":remark", $pay->remark, PDO::PARAM_STR);
            if (!$stmt2->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
            }
        }

        if ($total_price == $total_pay) {
            $sql = "
            update iv_master 
            set
            doc_status = 'ชำระเงินครบแล้ว',
            updated_date = CURRENT_TIMESTAMP(),
            updated_by = :action_user
            where ivcode = :ivcode";

            $stmt = $conn->prepare($sql);
            if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);
            $stmt->bindParam(":ivcode", $header->ivcode, PDO::PARAM_STR);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }
        } else if ($total_pay == 0) {
            $sql = "
            update iv_master 
            set
            doc_status = 'รอชำระเงิน',
            updated_date = CURRENT_TIMESTAMP(),
            updated_by = :action_user
            where ivcode = :ivcode";

            $stmt = $conn->prepare($sql);
            if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);
            $stmt->bindParam(":ivcode", $header->ivcode, PDO::PARAM_STR);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }
        } else {
            $sql = "
            update iv_master 
            set
            doc_status = 'ชำระเงินยังไม่ครบ',
            updated_date = CURRENT_TIMESTAMP(),
            updated_by = :action_user
            where ivcode = :ivcode";

            $stmt = $conn->prepare($sql);
            if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);
            $stmt->bindParam(":ivcode", $header->ivcode, PDO::PARAM_STR);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data" => array("code" => $code, "total_pay" => $total_pay, "total_price" => $total_price)));
    } else  if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
        // $code = $_DELETE["code"];
        $code = $_GET["code"];

        $sql = "update iv_master set doc_status = 'ยกเลิก' where ivcode = :code";
        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $strSQL = "SELECT recode FROM iv_detail where ivcode = :code ";
        $stmt5 = $conn->prepare($strSQL);
        if (!$stmt5) throw new PDOException("Insert data error => {$conn->errorInfo()}");


        if (!$stmt5->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $res = $stmt5->fetchAll(PDO::FETCH_ASSOC);

        foreach ($res as $row) {

            $sql = "update receipt set doc_status = 'รอออกใบวางบิล' where recode = :recode";
            $stmt2 = $conn->prepare($sql);
            if (!$stmt2->execute(['recode' => $row['recode']])) {
                $error = $conn->errorInfo();
                throw new PDOException("Remove data error => $error");
            }
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("status" => 1));
    } else  if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $code = $_GET["code"];
        $sql = "SELECT a.*,c.* ";
        $sql .= " FROM `iv_master` as a left outer join customer as c on (a.cuscode=c.cuscode) ";
        $sql .= " where a.ivcode = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $header = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT a.ivcode,a.recode,r.grand_total_price as price,r.redate,r.duedate,r.remark ";
        $sql .= " FROM `iv_detail` as a inner join `receipt` as r on (a.recode=r.recode)  ";
        $sql .= " where a.ivcode = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $detail = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $sql = "SELECT code,ivcode,paydate,price,payment_type,bank,bank_name_th,bank_name,bank_no,remark ";
        $sql .= " FROM `iv_payment`  ";
        $sql .= " where ivcode = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $payment = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $conn->commit();
        http_response_code(200);
        echo json_encode(array('status' => 1, 'data' => array("header" => $header, "detail" => $detail, "payment" => $payment)));
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
