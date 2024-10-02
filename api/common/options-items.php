<?php
ob_start();
include_once(dirname(__FILE__, 2) . "/onload.php");
$db = new DbConnect;
$conn = $db->connect();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    extract($_GET, EXTR_OVERWRITE, "_");
    $type_code = !empty($type) ? "and  lower(t.typename) = lower('$type')" : "";
    try {
        $p = $p ?? "";
        $res = null;
        if ($p == 'items') {
            ////ใช้เปิดPO
            $sql = "
			select i.*, UUID() `key`
            from items i
            where 1 = 1 and i.active_status = 'Y'
            $type_code";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $dataArray = array();
            //$dataFile = array();
            foreach ($data as $row) {
                $nestedObject = new stdClass();
                $nestedObject->stcode = $row['stcode'];
                $nestedObject->stname = $row['stname'];
                $nestedObject->price = $row['buyprice'];
                $nestedObject->unit = $row['unit'];
                $nestedObject->qty = $row['qty'];
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
        } else if($p == 'po'){
            $sql = "
			SELECT a.code,a.pocode, a.stcode,i.stname, a.qty, a.price, a.unit, a.discount, a.recamount
            FROM podetail a 
            inner join pomaster b on (a.pocode=b.pocode)
            inner join items i on (a.stcode=i.stcode)
            where b.supcode= '$supcode' and b.active_status = 'Y' and b.doc_status != 'รับของครบแล้ว' "; 

            $stmt = $conn->prepare($sql); 
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $dataArray = array();
            //$dataFile = array();
            foreach ($data as $row) {
                $nestedObject = new stdClass();
                $nestedObject->code = $row['code'];
                $nestedObject->stcode = $row['stcode'];
                $nestedObject->stname = $row['stname'];
                $nestedObject->price = $row['price'];
                $nestedObject->unit = $row['unit'];
                $nestedObject->qty = $row['qty'];
                $nestedObject->recamount = $row['recamount'];
                $nestedObject->pocode = $row['pocode'];
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
        } else {
            $sql = "
            select  i.stcode value, i.stname label 
            from items i
            where 1 = 1 and i.active_status = 'Y'
            $type_code";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode(array("data" => $res));
        }

       
    } catch (mysqli_sql_exception $e) {
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
        //throw $exception;
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
    } finally {
        // Ignore

    }
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
ob_end_flush();
exit;
