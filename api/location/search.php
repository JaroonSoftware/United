<?php
ob_start();
include_once(dirname(__FILE__, 2) . "/onload.php");
$db = new DbConnect;
$conn = $db->connect();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);

    extract($_POST, EXTR_OVERWRITE, "_");


    $location_code = !empty($location_code) ? "and a.location_code like '%$location_code%'" : "";
    $location_name = !empty($location_name) ? "and a.location_name like '%$location_name%'" : "";

    try {
        $sql = "SELECT a.location_code, a.location_name, a.active_status FROM `location` as a     
        where 1 = 1
        $location_code
        $location_name
        order by a.created_date desc";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode(array("data" => $res));
    } catch (mysqli_sql_exception $e) {
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
        //throw $exception;
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
    } finally {
        $conn = null;
    }
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
ob_end_flush();
exit;
