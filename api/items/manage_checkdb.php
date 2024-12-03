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

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $rest_json = file_get_contents("php://input");
        $_POST = json_decode($rest_json, true);
        extract($_POST, EXTR_OVERWRITE, "_");

        // var_dump($_POST);

        $sql = "SELECT a.stcode, a.stname, b.type_name,a.price,a.min,s.qty ,a.active_status FROM `items` as a
        left outer join `items_type` as b on (a.type_code=b.type_code)   
        left outer join items_stock as s on (a.stcode=s.stcode)
        where 1 = 1   
        $stcode
        $stname
        $type_code
        order by a.created_date desc";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($data as $row) {

            $sql = "INSERT INTO items_stock (stcode,price,amtprice,qty,places,created_by,created_date) 
            values (:stcode,0,0,0,'1',:action_user,:action_date)";

            $stmt = $conn->prepare($sql);
            if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            
            $stmt->bindParam(":stcode", $row['stcode'], PDO::PARAM_STR);
            $stmt->bindParam(":action_date", $action_date, PDO::PARAM_STR);
            $stmt->bindParam(":action_user", $action_user, PDO::PARAM_STR);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }     
        }
        
        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data" => array("id" => "ok")));
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
