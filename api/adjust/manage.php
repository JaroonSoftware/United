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
        $sql = "insert adjust (`adcode`, `addate`,`remark`,created_by,updated_by) 
        values (:adcode,:addate,:remark,:action_user,:action_user)";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $header = (object)$header;
        $stmt->bindParam(":adcode", $header->adcode, PDO::PARAM_STR);
        $stmt->bindParam(":addate", $header->addate, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_STR);

        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        update_adcode($conn);

        $code = $conn->lastInsertId();
        // var_dump($master); exit;

        $sql = "insert into adjust_detail (adcode,stcode,qty,price,unit)
        values (:adcode,:stcode,:qty,:price,:unit)";
        $stmt2 = $conn->prepare($sql);
        if (!$stmt2) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt2->bindParam(":adcode", $header->adcode, PDO::PARAM_STR);
            $stmt2->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);
            $stmt2->bindParam(":qty", $val->qty, PDO::PARAM_INT);
            $stmt2->bindParam(":price", $val->price, PDO::PARAM_INT);
            $stmt2->bindParam(":unit", $val->unit, PDO::PARAM_STR);

            if (!$stmt2->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
            }

            $sql2 = "UPDATE items_stock SET qty= qty+:qty,price= price + (:price*:qty),amtprice= price/qty ,updated_date = CURRENT_TIMESTAMP() where stcode =:stcode ";
            $stmt3 = $conn->prepare($sql2);
            if (!$stmt3) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt3->bindParam(":price", $val->price, PDO::PARAM_STR);
            $stmt3->bindParam(":qty", $val->qty, PDO::PARAM_STR);
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
    } else  if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $code = $_GET["code"];
        $sql = " SELECT a.adcode,a.addate,a.remark ";
        $sql .= " FROM `adjust` as a ";
        $sql .= " where a.adcode = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $header = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT a.adcode,a.stcode, a.price, a.unit, a.qty ,i.stname,k.kind_name ";
        $sql .= " FROM `adjust_detail` as a inner join `items` as i on (a.stcode=i.stcode) left outer join kind k on (i.kind_code=k.kind_code)  ";
        $sql .= " where a.adcode = :code";

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
            $nestedObject->stcode = $row['stcode'];
            $nestedObject->stname = $row['stname'];
            $nestedObject->price = $row['price'];
            $nestedObject->unit = $row['unit'];
            $nestedObject->qty = $row['qty'];
            $nestedObject->kind_name = $row['kind_name'];
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
            "message" => "Get Product E-commerce",
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
