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
        $sql = "insert somaster (`socode`,`delcode`,`qtcode`, `sodate`, `cuscode`,
       `total_price`, `vat`, `grand_total_price`,`claim_no`,`require_no`,`car_engineno`,`car_model_code`,`car_no`,`remark`,created_by,updated_by) 
        values (:socode,:delcode,:qtcode,:sodate,:cuscode,:total_price,:vat,:grand_total_price,:claim_no,:require_no,:car_engineno,:car_model_code,:car_no,
        :remark,:action_user,:action_user)";
      
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $header = (object)$header;
        $stmt->bindParam(":socode", $header->socode, PDO::PARAM_STR);
        $stmt->bindParam(":delcode", $header->delcode, PDO::PARAM_STR);
        $stmt->bindParam(":qtcode", $header->qtcode, PDO::PARAM_STR);
        $stmt->bindParam(":sodate", $header->sodate, PDO::PARAM_STR);
        $stmt->bindParam(":cuscode", $header->cuscode, PDO::PARAM_STR);
        $stmt->bindParam(":total_price", $header->total_price, PDO::PARAM_STR);
        $stmt->bindParam(":vat", $header->vat, PDO::PARAM_STR);
        $stmt->bindParam(":grand_total_price", $header->grand_total_price, PDO::PARAM_STR);
        $stmt->bindParam(":claim_no", $header->claim_no, PDO::PARAM_STR);
        $stmt->bindParam(":require_no", $header->require_no, PDO::PARAM_STR);
        $stmt->bindParam(":car_engineno", $header->car_engineno, PDO::PARAM_STR);
        $stmt->bindParam(":car_model_code", $header->car_model_code, PDO::PARAM_STR);
        $stmt->bindParam(":car_no", $header->car_no, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_STR);

        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        if ($header->qtcode != '') {
            $sql = "
            update qtmaster 
            set
            doc_status = 'ออกใบขายสินค้าแล้ว',
            updated_date = CURRENT_TIMESTAMP(),
            updated_by = :action_user
            where qtcode = :qtcode";

            $stmt = $conn->prepare($sql);
            if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);
            $stmt->bindParam(":qtcode", $header->qtcode, PDO::PARAM_STR);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }
        }

        update_socode($conn);

        $code = $conn->lastInsertId();
        // var_dump($master); exit;

        $sql = "insert into sodetail (socode,stcode,qty,price,unit,discount)
        values (:socode,:stcode,:qty,:price,:unit,:discount)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt->bindParam(":socode", $header->socode, PDO::PARAM_STR);
            $stmt->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);
            $stmt->bindParam(":qty", $val->qty, PDO::PARAM_INT);
            $stmt->bindParam(":price", $val->price, PDO::PARAM_INT);
            $stmt->bindParam(":unit", $val->unit, PDO::PARAM_STR);
            $stmt->bindParam(":discount", $val->discount, PDO::PARAM_INT);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
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
        update somaster 
        set
        delcode = :delcode,
        qtcode = :qtcode,
        sodate = :sodate,
        cuscode = :cuscode,
        total_price = :total_price,
        vat = :vat,
        grand_total_price = :grand_total_price,
        claim_no = :claim_no,
        require_no = :require_no,
        car_engineno = :car_engineno,
        car_model_code = :car_model_code,
        car_no = :car_no,
        remark = :remark,
        updated_date = CURRENT_TIMESTAMP(),
        updated_by = :action_user
        where socode = :socode";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $header = (object)$header;
    
        $stmt->bindParam(":cuscode", $header->cuscode, PDO::PARAM_STR);
        $stmt->bindParam(":total_price", $header->total_price, PDO::PARAM_STR);
        $stmt->bindParam(":vat", $header->vat, PDO::PARAM_STR);
        $stmt->bindParam(":grand_total_price", $header->grand_total_price, PDO::PARAM_STR);
        $stmt->bindParam(":claim_no", $header->claim_no, PDO::PARAM_STR);
        $stmt->bindParam(":require_no", $header->require_no, PDO::PARAM_STR);
        $stmt->bindParam(":car_engineno", $header->car_engineno, PDO::PARAM_STR);
        $stmt->bindParam(":car_model_code", $header->car_model_code, PDO::PARAM_STR);
        $stmt->bindParam(":car_no", $header->car_no, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);
        $stmt->bindParam(":delcode", $header->delcode, PDO::PARAM_STR);
        $stmt->bindParam(":qtcode", $header->qtcode, PDO::PARAM_STR);
        $stmt->bindParam(":sodate", $header->sodate, PDO::PARAM_STR);
        $stmt->bindParam(":socode", $header->socode, PDO::PARAM_STR);

        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $sql = "delete from sodetail where socode = :socode";
        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['socode' => $header->socode])) {
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $sql = "insert into sodetail (socode,stcode,unit,qty,price,discount)
        values (:socode,:stcode,:unit,:qty,:price,:discount)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt->bindParam(":socode", $header->socode, PDO::PARAM_STR);
            $stmt->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);
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
        
        $sql = "update somaster set doc_status = 'ยกเลิก' where socode = :code";
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
        $sql = "SELECT a.socode,a.sodate,a.qtcode,a.delcode,a.cuscode,a.claim_no,a.require_no,a.car_engineno,a.car_model_code,a.car_no,c.prename,c.cusname,CONCAT(COALESCE(c.idno, '') ,' ', COALESCE(c.road, ''),' ', COALESCE(c.subdistrict, ''),' ', COALESCE(c.district, ''),' ',COALESCE(c.zipcode, '') ) as address
        ,c.zipcode,c.contact,c.tel,c.fax,c.contact,c.tel,CONCAT(COALESCE(d.idno, '') ,' ', COALESCE(d.road, ''),' ', COALESCE(d.subdistrict, ''),' ', COALESCE(d.district, ''),' ',COALESCE(d.zipcode, '') )  as deladdress
        ,d.contact as delcontact,d.tel as deltel,a.total_price,a.vat,a.grand_total_price,a.remark,CONCAT(d.prename,' ',d.cusname) as delname,a.doc_status 
        ,m.car_model_code,m.brand_code,m.model_code,m.year";
        $sql .= " FROM `somaster` as a ";
        $sql .= " left outer join `customer` as c on (a.cuscode)=(c.cuscode)";
        $sql .= " left outer join `customer` as d on (a.delcode)=(d.cuscode)";
        $sql .= " left outer join `car_model` as m on (a.car_model_code)=(m.car_model_code)";
        // $sql .= " left outer join `brand` as b on (b.brand_code)=(m.brand_code)";
        // $sql .= " left outer join `model_table` as mo on (mo.model_code)=(m.model_code)";
        $sql .= " where a.socode = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $header = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT a.socode,a.stcode, a.price, a.discount, a.unit, a.qty ,i.stname ";
        $sql .= " FROM `sodetail` as a inner join `items` as i on (a.stcode=i.stcode)  ";
        $sql .= " where a.socode = :code";

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
