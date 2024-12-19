<?php
ob_start();
include_once(dirname(__FILE__, 2) . "/onload.php");
include_once(dirname(__FILE__, 2) . "/common/fnc-code.php");
$db = new DbConnect;
$conn = $db->connect();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    extract($_GET, EXTR_OVERWRITE, "_");

    $sql = "SELECT p.* ";
    $sql .= " FROM `iv_payment` as p  ";
    $sql .= " where p.ivcode = :code";

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
