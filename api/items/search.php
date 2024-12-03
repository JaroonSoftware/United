<?php
ob_start();
include_once(dirname(__FILE__, 2) . "/onload.php");
$db = new DbConnect;
$conn = $db->connect();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);

    extract($_POST, EXTR_OVERWRITE, "_");


    $stcode = !empty($stcode) ? "and a.stcode like '%$stcode%'" : "";
    $stname = !empty($stname) ? "and a.stname like '%$stname%'" : "";
    $type_code = !empty($type_code) ? "and a.type_code like '%$type_code%'" : "";
    try {
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
