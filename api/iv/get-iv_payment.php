<?php
ob_start();
include_once(dirname(__FILE__, 2) . "/onload.php");
include_once(dirname(__FILE__, 2) . "/common/fnc-code.php");
$db = new DbConnect;
$conn = $db->connect();
$conn->beginTransaction();


    $action_date = date("Y-m-d H:i:s");
    $action_user = $token->userid;

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $code = $_GET["code"];

    $sql = "SELECT p.*,m.*,c.*  ";
    $sql .= " FROM `iv_payment` as p  ";
    $sql .= " left outer join iv_master as m on p.ivcode=m.ivcode  ";
    $sql .= " left outer join customer as c on c.cuscode=m.cuscode  ";
    $sql .= " where p.code = :code";

    $stmt = $conn->prepare($sql);
    if (!$stmt->execute(['code' => $code])) {
        $error = $conn->errorInfo();
        http_response_code(404);
        throw new PDOException("Geting data error => $error");
    }
    $payment = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $conn->commit();
    http_response_code(200);
    echo json_encode(array('status' => 1, 'data' => array("payment" => $payment)));
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
ob_end_flush();
exit;
