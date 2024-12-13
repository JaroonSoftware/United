<?php
include_once(dirname(__FILE__, 2) . "/onload.php");
$db = new DbConnect;
$conn = $db->connect();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    extract($_GET, EXTR_OVERWRITE, "_");
    // $type_code = !empty($type) ? "and i.typecode = '$type'" : "";
    try {
        $sql = "
			SELECT a.code,a.recode, a.stcode,i.stname, a.qty, i.buyprice,s.amtprice, a.unit, a.discount, k.kind_name
            FROM receipt_detail a 
            inner join receipt b on (a.recode=b.recode)
            inner join items i on (a.stcode=i.stcode)
            inner join items_stock s on (s.stcode=i.stcode)
            left outer join kind k on (i.kind_code=k.kind_code)
            where b.cuscode= '$cuscode' and b.doc_status = 'รอออกใบวางบิล' "; 
            
            $stmt = $conn->prepare($sql); 
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $dataArray = array();
            //$dataFile = array();
            foreach ($data as $row) {
                $nestedObject = new stdClass();
                $nestedObject->code = $row['code'];
                $nestedObject->recode = $row['recode'];
                $nestedObject->stcode = $row['stcode'];
                $nestedObject->stname = $row['stname'];
                $nestedObject->buyprice = $row['buyprice'];
                $nestedObject->amtprice = $row['amtprice'];
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
                "data" => $dataArray,
                // "sql" => $sql,
            );


            http_response_code(200);
            echo json_encode($apiResponse);
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

exit;
