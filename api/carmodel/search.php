<?php
ob_start();
include_once(dirname(__FILE__, 2) . "/onload.php");
$db = new DbConnect;
$conn = $db->connect();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);

    extract($_POST, EXTR_OVERWRITE, "_");


    $car_model_code = !empty($car_model_code) ? "and a.car_model_code like '%$car_model_code%'" : "";
    $car_model_name = !empty($car_model_name) ? "and a.car_model_name like '%$car_model_name%'" : "";
    $brand_code = !empty($brand_code) ? "and a.brand_code like '%$brand_code%'" : "";
    $model_code = !empty($model_code) ? "and a.model_code like '%$model_code%'" : "";

    try {
        $sql = "SELECT a.car_model_code, a.car_model_name, a.year, b.brand_name, c.model_name, a.active_status FROM `car_model` as a     
        left outer join `brand` as b on (a.brand_code=b.brand_code)   
        left outer join `model_table` as c on (a.model_code=c.model_code)   
        where 1 = 1
        $car_model_code
        $car_model_name
        $brand_code
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
