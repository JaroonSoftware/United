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

        // var_dump($_POST);
        $sql = "insert pomaster (`pocode`, `podate`, `supcode`,
        `deldate`,`payment`,`poqua`, `total_price`, `vat`, `grand_total_price`,`remark`,created_by,updated_by) 
        values (:pocode,:podate,:supcode,:deldate,:payment,:poqua,:total_price,:vat,:grand_total_price,
        :remark,:action_user,:action_user)";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $header = (object)$header;
        $stmt->bindParam(":pocode", $header->pocode, PDO::PARAM_STR);
        $stmt->bindParam(":podate", $header->podate, PDO::PARAM_STR);
        $stmt->bindParam(":supcode", $header->supcode, PDO::PARAM_STR);
        $stmt->bindParam(":deldate", $header->deldate, PDO::PARAM_STR);
        $stmt->bindParam(":payment", $header->payment, PDO::PARAM_STR);
        $stmt->bindParam(":poqua", $header->poqua, PDO::PARAM_STR);
        $stmt->bindParam(":total_price", $header->total_price, PDO::PARAM_STR);
        $stmt->bindParam(":vat", $header->vat, PDO::PARAM_STR);
        $stmt->bindParam(":grand_total_price", $header->grand_total_price, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_STR);

        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        update_pocode($conn);

        $code = $conn->lastInsertId();
        // var_dump($master); exit;

        $sql = "insert into podetail (pocode,stcode,qty,price,unit,discount,recamount)
        values (:pocode,:stcode,:qty,:price,:unit,:discount,0)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt->bindParam(":pocode", $header->pocode, PDO::PARAM_STR);
            $stmt->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);
            $stmt->bindParam(":qty", $val->qty, PDO::PARAM_INT);
            $stmt->bindParam(":price", $val->price, PDO::PARAM_INT);
            $stmt->bindParam(":unit", $val->unit, PDO::PARAM_STR);
            $stmt->bindParam(":discount", $val->discount, PDO::PARAM_STR);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
            }

            $sql = "update sodetail set buyamount = buyamount+:qty where socode = :socode and stcode = :stcode";

            $stmt3 = $conn->prepare($sql);
            if (!$stmt3) throw new PDOException("Insert data error => {$conn->errorInfo()}");

            $stmt3->bindParam(":qty", $val->qty, PDO::PARAM_STR);
            $stmt3->bindParam(":socode", $val->socode, PDO::PARAM_STR);
            $stmt3->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);

            if (!$stmt3->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
                die;
            }
        }



        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data" => array("code" => $code)));
    } else  if ($_SERVER["REQUEST_METHOD"] == "PUT") {
        $rest_json = file_get_contents("php://input");
        $_PUT = json_decode($rest_json, true);
        extract($_PUT, EXTR_OVERWRITE, "_");
        // var_dump($_POST);
        $sql = "
        update pomaster 
        set
        podate = :podate,
        supcode = :supcode,
        deldate = :deldate,        
        payment = :payment,
        poqua = :poqua,
        total_price = :total_price,
        vat = :vat,
        grand_total_price = :grand_total_price,
        remark = :remark,
        updated_date = CURRENT_TIMESTAMP(),
        updated_by = :action_user
        where pocode = :pocode";

        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        $header = (object)$header;

        $stmt->bindParam(":podate", $header->podate, PDO::PARAM_STR);
        $stmt->bindParam(":supcode", $header->supcode, PDO::PARAM_STR);
        $stmt->bindParam(":deldate", $header->deldate, PDO::PARAM_STR);
        $stmt->bindParam(":payment", $header->payment, PDO::PARAM_STR);
        $stmt->bindParam(":poqua", $header->poqua, PDO::PARAM_STR);
        $stmt->bindParam(":total_price", $header->total_price, PDO::PARAM_STR);
        $stmt->bindParam(":vat", $header->vat, PDO::PARAM_STR);
        $stmt->bindParam(":grand_total_price", $header->grand_total_price, PDO::PARAM_STR);
        $stmt->bindParam(":remark", $header->remark, PDO::PARAM_STR);
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT);
        $stmt->bindParam(":pocode", $header->pocode, PDO::PARAM_STR);

        if (!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $sql = "delete from podetail where pocode = :pocode";
        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['pocode' => $header->pocode])) {
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $sql = "insert into podetail (pocode,stcode,unit,qty,price,discount,recamount)
        values (:pocode,:stcode,:unit,:qty,:price,:discount,:recamount)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}");

        // $detail = $detail;  
        foreach ($detail as $ind => $val) {
            $val = (object)$val;
            $stmt->bindParam(":pocode", $header->pocode, PDO::PARAM_STR);
            $stmt->bindParam(":stcode", $val->stcode, PDO::PARAM_STR);
            $stmt->bindParam(":unit", $val->unit, PDO::PARAM_STR);
            $stmt->bindParam(":qty", $val->qty, PDO::PARAM_INT);
            $stmt->bindParam(":price", $val->price, PDO::PARAM_INT);
            $stmt->bindParam(":discount", $val->discount, PDO::PARAM_STR);
            $stmt->bindParam(":recamount", $val->recamount, PDO::PARAM_INT);

            if (!$stmt->execute()) {
                $error = $conn->errorInfo();
                throw new PDOException("Insert data error => $error");
            }
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("data" => array("code" => $code)));
    } else  if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
        // $code = $_DELETE["code"];
        $code = $_GET["code"];

        $sql = "update pomaster set doc_status = 'ยกเลิก' where pocode = :code";
        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            throw new PDOException("Remove data error => $error");
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(array("status" => 1));
    } else  if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $code = $_GET["code"];
        $sql = " SELECT a.pocode,a.podate,a.supcode,c.prename,c.supname,CONCAT(COALESCE(c.idno, '') ,' ', COALESCE(c.road, ''),' ', COALESCE(c.subdistrict, ''),' ', COALESCE(c.district, ''),' ',COALESCE(c.zipcode, '') ) as address
        ,c.zipcode,c.contact,c.tel,c.fax,a.deldate,a.payment,a.poqua,a.total_price,a.vat,a.grand_total_price,a.remark,a.doc_status ";
        $sql .= " FROM `pomaster` as a ";
        $sql .= " left outer join `supplier` as c on (a.supcode)=(c.supcode)";
        $sql .= " where a.pocode = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $header = $stmt->fetch(PDO::FETCH_ASSOC);

        $sql = "SELECT a.pocode,a.stcode, a.price, a.discount, a.unit, a.qty ,i.stname,a.recamount, k.kind_name ";
        $sql .= " FROM `podetail` as a inner join `items` as i on (a.stcode=i.stcode) left outer join kind k on (i.kind_code=k.kind_code)  ";
        $sql .= " where a.pocode = :code";

        $stmt = $conn->prepare($sql);
        if (!$stmt->execute(['code' => $code])) {
            $error = $conn->errorInfo();
            http_response_code(404);
            throw new PDOException("Geting data error => $error");
        }
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $dataArray = array();
        //$dataFile = array();
        foreach ($data as $row) {
            $nestedObject = new stdClass();
            $nestedObject->stcode = $row['stcode'];
            $nestedObject->stname = $row['stname'];
            $nestedObject->price = $row['price'];
            $nestedObject->unit = $row['unit'];
            $nestedObject->qty = $row['qty'];
            $nestedObject->discount = $row['discount'];
            $nestedObject->kind_name = $row['kind_name'];
            $nestedObject->recamount = $row['recamount'];
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
            "header" => $header,
            "detail" => $dataArray,
            // "sql" => $sql,

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
