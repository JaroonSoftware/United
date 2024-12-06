<?php 
ob_start(); 
include_once(dirname(__FILE__, 2)."/onload.php");
include_once(dirname(__FILE__, 2)."/common/fnc-code.php");

$db = new DbConnect;
$conn = $db->connect();
$conn->beginTransaction();
http_response_code(400);
try {
    $action_date = date("Y-m-d H:i:s"); 
    $action_user = $token->userid;
    // echo $action_user;

    if ($_SERVER["REQUEST_METHOD"] == "POST"){
        $rest_json = file_get_contents("php://input");
        $_POST = json_decode($rest_json, true); 
        extract($_POST, EXTR_OVERWRITE, "_");

        // var_dump($_POST);
        $sql = "insert receipt (`recode`, `redate`, `cuscode`,total_price,vat,`remark`,created_by,updated_by) 
        values (:recode,:redate,:cuscode,:total_price,:vat,
        :remark,:action_user,:action_user)";
        
        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 

        $header = (object)$header;  
        $stmt->bindParam(":recode", $header->recode, PDO::PARAM_STR);
        $stmt->bindParam(":redate", $header->redate, PDO::PARAM_STR);
        $stmt->bindParam(":cuscode", $header->cuscode, PDO::PARAM_STR);  
        $stmt->bindParam(":total_price", $header->total_price, PDO::PARAM_STR); 
        $stmt->bindParam(":vat", $header->vat, PDO::PARAM_STR);      
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR); 
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_STR); 

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $sql = "
            update ivmaster 
            set
            doc_status = 'ออกใบเสร็จแล้ว',
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

        update_recode($conn);

        $total_price=0;
        $total_pay=0;

        $sql = "insert into receipt_detail (recode,ivcode,stcode,unit,qty,price,discount)
        values (:recode,:ivcode,:stcode,:unit,:qty,:price,:discount)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt->bindParam(":recode", $header->recode, PDO::PARAM_STR);
            $stmt->bindParam(":ivcode", $val->ivcode, PDO::PARAM_STR);
            $stmt->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);
            $stmt->bindParam(":unit", $val->unit, PDO::PARAM_STR);
            $stmt->bindParam(":qty", $val->qty, PDO::PARAM_INT);
            $stmt->bindParam(":price", $val->price, PDO::PARAM_INT);
            $stmt->bindParam(":discount", $val->discount, PDO::PARAM_INT);
            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
            }

            $total_price+=($val->price*$val->qty)*(1-($val->discount/100));
        }

        $sql = "insert into receipt_payment (recode,paydate,price,payment_type,bank,bank_name_th,bank_name,bank_no,remark)
        values (:recode,:paydate,:price,:payment_type,:bank,:bank_name_th,:bank_name,:bank_no,:remark)";
        $stmt2 = $conn->prepare($sql);
        if (!$stmt2) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        

        foreach ($payment as $ind => $pay) {
            $pay = (object)$pay;
            $stmt2->bindParam(":recode", $header->recode, PDO::PARAM_STR);
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

            $total_pay+=$pay->price;
        }

        

        if ($total_price == $total_pay) {
            $sql = "
            update receipt 
            set
            doc_status = 'ชำระแล้ว',
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
        }
        else if ($total_pay == 0) {
            $sql = "
            update receipt 
            set
            doc_status = 'รอชำระเงิน',
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
        }
        else{
            $sql = "
            update receipt 
            set
            doc_status = 'ชำระยังไม่ครบ',
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
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("code" => $code,"total_pay" => $total_pay,"total_price" => $total_price)));

    } else  if($_SERVER["REQUEST_METHOD"] == "PUT"){
        $rest_json = file_get_contents("php://input");
        $_PUT = json_decode($rest_json, true); 
        extract($_PUT, EXTR_OVERWRITE, "_");
        // var_dump($_POST);

        $sql = "
        update receipt 
        set
        redate = :redate,
        cuscode = :cuscode,
        total_price = :total_price,
        vat = :vat,
        remark = :remark,
        updated_date = CURRENT_TIMESTAMP(),
        updated_by = :action_user
        where recode = :recode";

        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 

        $header = (object)$header; 
        
        $stmt->bindParam(":redate", $header->redate, PDO::PARAM_STR);
        $stmt->bindParam(":cuscode", $header->cuscode, PDO::PARAM_STR);   
        $stmt->bindParam(":total_price", $header->total_price, PDO::PARAM_STR); 
        $stmt->bindParam(":vat", $header->vat, PDO::PARAM_STR);        
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR); 
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);  
        $stmt->bindParam(":recode", $header->recode, PDO::PARAM_STR); 

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $total_price=0;
        $total_pay=0;

        $sql = "delete from receipt_detail where recode = :recode";
        $stmt3 = $conn->prepare($sql);
        if (!$stmt3->execute(['recode' => $header->recode])) {
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $sql = "insert into receipt_detail (recode,ivcode,stcode,unit,qty,price,discount)
        values (:recode,:ivcode,:stcode,:unit,:qty,:price,:discount)";
        $stmt5 = $conn->prepare($sql);
        if (!$stmt5) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt5->bindParam(":recode", $header->recode, PDO::PARAM_STR);
            $stmt5->bindParam(":ivcode", $val->ivcode, PDO::PARAM_STR);
            $stmt5->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);
            $stmt5->bindParam(":price", $val->price, PDO::PARAM_INT);
            $stmt5->bindParam(":unit", $val->unit, PDO::PARAM_STR);
            $stmt5->bindParam(":qty", $val->qty, PDO::PARAM_INT);
            $stmt5->bindParam(":discount", $val->discount, PDO::PARAM_INT);
            if (!$stmt5->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
            }

            $total_price+=($val->price*$val->qty)*(1-($val->discount/100));
        }

        $sql = "delete from receipt_payment where recode = :recode";
        $stmt4 = $conn->prepare($sql);
        if (!$stmt4->execute(['recode' => $header->recode])) {
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $sql = "insert into receipt_payment (recode,paydate,price,payment_type,bank,bank_name_th,bank_name,bank_no,remark)
        values (:recode,:paydate,:price,:payment_type,:bank,:bank_name_th,:bank_name,:bank_no,:remark)";
        $stmt2 = $conn->prepare($sql);
        if (!$stmt2) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($payment as $ind => $pay) {
            $pay = (object)$pay;
            $stmt2->bindParam(":recode", $header->recode, PDO::PARAM_STR);
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

            $total_pay+=$pay->price;
        }

        if ($total_price == $total_pay) {
            $sql = "
            update receipt 
            set
            doc_status = 'ชำระแล้ว',
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
        }
        else if ($total_pay == 0) {
            $sql = "
            update receipt 
            set
            doc_status = 'รอชำระเงิน',
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
        }
        else{
            $sql = "
            update receipt 
            set
            doc_status = 'ชำระยังไม่ครบ',
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
        }
        
        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data"=> array("code" => $code,"total_pay" => $total_pay,"total_price" => $total_price)));
    } else  if($_SERVER["REQUEST_METHOD"] == "DELETE"){
        // $code = $_DELETE["code"];
        $code = $_GET["code"];
        
        $sql = "update receipt set doc_status = 'ยกเลิก' where recode = :code";
        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'code' => $code ])){
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }    

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("status"=> 1));
    } else  if($_SERVER["REQUEST_METHOD"] == "GET"){
        $code = $_GET["code"]; 
        $sql = "SELECT a.*,c.* ";
        $sql .= " FROM `receipt` as a left outer join customer as c on (a.cuscode=c.cuscode) ";        
        $sql .= " where a.recode = :code";

        $stmt = $conn->prepare($sql); 
        if (!$stmt->execute([ 'code' => $code ])){
            $error = $conn->errorInfo(); 
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $header = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT a.recode,a.ivcode,a.stcode, a.price, a.discount, a.unit, a.qty ,i.stname ";
        $sql .= " FROM `receipt_detail` as a inner join `items` as i on (a.stcode=i.stcode)  ";
        $sql .= " where a.recode = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $detail = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $sql = "SELECT recode,paydate,price,payment_type,bank,bank_name_th,bank_name,bank_no,remark ";
        $sql .= " FROM `receipt_payment`  ";
        $sql .= " where recode = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $payment = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $conn->commit();
        http_response_code(200);
        echo json_encode(array('status' => 1, 'data' => array("header" => $header, "detail" => $detail ,"payment" => $payment)));
    }

} catch (PDOException $e) { 
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} catch (Exception $e) { 
    $conn->rollback();
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
} finally{
    $conn = null;
}  
ob_end_flush(); 
exit;