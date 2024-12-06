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
        $sql = "insert dnmaster (`dncode`, `dndate`, `cuscode`,`remark`,created_by,updated_by) 
        values (:dncode,:dndate,:cuscode,:remark,:action_user,:action_user)";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $header = (object)$header;
        $stmt->bindParam(":dncode", $header->dncode, PDO::PARAM_STR);
        $stmt->bindParam(":dndate", $header->dndate, PDO::PARAM_STR);
        $stmt->bindParam(":cuscode", $header->cuscode, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_STR);

        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }
        
        update_dncode($conn);
        $code = $conn->lastInsertId();

        $sql = "insert into dndetail (dncode,socode,qty,price,unit)
        values (:dncode,:socode,:qty,:price,:unit)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt->bindParam(":dncode", $header->dncode, PDO::PARAM_STR);
            $stmt->bindParam(":socode", $val->socode, PDO::PARAM_STR);
            $stmt->bindParam(":qty", $val->qty, PDO::PARAM_INT);
            $stmt->bindParam(":price", $val->price, PDO::PARAM_INT);
            $stmt->bindParam(":unit", $val->unit, PDO::PARAM_STR);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
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
        updated_date = CURRENT_TIMESTAMP(),
        updated_by = :action_user
        where dncode = :dncode";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $header = (object)$header;

        $stmt->bindParam(":cuscode", $header->cuscode, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR);
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

        $sql = "insert into dndetail (dncode,socode)
        values (:dncode,:socode)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt->bindParam(":dncode", $header->dncode, PDO::PARAM_STR);
            $stmt->bindParam(":socode", $header->socode, PDO::PARAM_STR);
        
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

        $sql = "delete from packingset where code = :code";
        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $sql = "delete from packingset_detail where packingsetcode = :code";
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
        $sql = "SELECT a.dncode,a.cuscode,a.dndate,a.remark,c.prename,c.cusname,CONCAT(COALESCE(c.idno, '') ,' ', COALESCE(c.road, ''),' ', COALESCE(c.subdistrict, ''),' ', COALESCE(c.district, ''),' ',COALESCE(c.zipcode, '') ) as address";
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

        $sql = "SELECT a.dncode,a.socode,c.grand_total_price,c.sodate,c.cuscode,d.cusname";
        $sql .= " FROM `dndetail` as a";
        $sql .= " inner join `somaster` as c on (a.socode)=(c.socode) left outer join `customer` d on (c.cuscode)=(d.cuscode) ";
        $sql .= " where dncode = :code";

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
