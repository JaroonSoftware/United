<?php
ob_start();
include_once(dirname(__FILE__, 2) . "/onload.php");
$db = new DbConnect;
$conn = $db->connect();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);

    extract($_POST, EXTR_OVERWRITE, "_");


    $stcode = !empty($stcode) ? "and i.stcode like '%$stcode%'" : "";
    $stname = !empty($stname) ? "and i.stname like '%$stname%'" : "";
    $type_name = !empty($type_name) ? "and t.type_name like '%$type_name%'" : "";
    $kind_name = !empty($kind_name) ? "and k.kind_name like '%$kind_name%'" : "";
    $brand_name = !empty($brand_name) ? "and b.brand_name like '%$brand_name%'" : "";
    $car_model_name = !empty($car_model_name) ? "and cm.car_model_name like '%$car_model_name%'" : "";
    $year = !empty($year) ? "and cm.year like '%$year%'" : "";    

    $condition = "$stcode
    $stname
    $cuscode
    $cusname
    $type_name
    $kind_name
    $brand_name
    $car_model_name
    $year";

    try {
        $sql = "SELECT i.stcode, i.stname, t.type_name,i.price,i.min,s.qty ,i.active_status FROM `items` as i
        left join items_type t on i.type_code = t.type_code
        left join kind k on k.kind_code = i.kind_code
        left join car_model cm on cm.car_model_code = i.car_model_code
        left join brand b on cm.brand_code = b.brand_code 
        left outer join items_stock as s on (i.stcode=s.stcode)
        where 1 = 1 
        $condition
        order by i.created_date desc";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $dataArray = array();
        //$dataFile = array();
        foreach ($data as $row) {
            $nestedObject = new stdClass();
            $nestedObject->stcode = $row['stcode'];
            $nestedObject->stname = $row['stname'];
            $nestedObject->price = $row['price'];
            $nestedObject->unit = $row['unit'];
            $nestedObject->qty = strval($row['qty']);
            $nestedObject->active_status = $row['active_status'];
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
            "data" => $dataArray,
            // "sql" => $sql,
        );


        http_response_code(200);
        echo json_encode($apiResponse);
        // echo json_encode(array("data" => $res));
        // echo json_encode(array("data" => $res,"sql" => $sql));
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
