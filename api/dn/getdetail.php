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
        // $detail = (object)$detail;
        $tmp_array=array();
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            array_push($tmp_array,"'".$val->dncode."'");
        }
        
        // implode(',',$array_of_ids)
        // foreach ($detail as $ind => $val) {
        //     $val = (object)$val;
        //     $d.find( d => d == "0") || !bankid[0]  ? null : `${bankid.join(`,`)}`,
            
        // }

        $code = $_GET["code"];

        $sql = "SELECT a.code,a.dncode,a.stcode,s.socode, a.price, a.unit, a.qty ,i.stname,a.discount,s.delamount, k.kind_name ";
        $sql .= " FROM `dndetail` as a";
        $sql .= " inner join `items` as i on (a.stcode=i.stcode)  ";
        $sql .= " left outer join `sodetail` as s on a.stcode=s.stcode and a.socode=s.socode  ";
        $sql .= " left outer join kind k on (i.kind_code=k.kind_code)  ";
        $sql .= " where a.dncode IN (". implode(',',$tmp_array) . ")";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
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
            $nestedObject->discount = $row['discount']; 
            $nestedObject->socode = $row['socode'];        
            $nestedObject->dncode = $row['dncode'];    
            $nestedObject->delamount = $row['delamount']; 
            $nestedObject->kind_name = $row['kind_name']; 
            $nestedObject->cost = $row['cost']; 
                
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
            "message" => "Get Product",
            "detail" => $dataArray,
            "sql" => $tmp,
            
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
