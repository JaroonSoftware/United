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

    if ($_SERVER["REQUEST_METHOD"] == "POST"){
        $rest_json = file_get_contents("php://input");
        $_POST = json_decode($rest_json, true); 
        extract($_POST, EXTR_OVERWRITE, "_");

        $sql = "SELECT number as cuscode FROM `cuscode` ";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        $code = sprintf("C%06s", ( intval($res["cuscode"])) );

        http_response_code(200);
        $cuscode = $code;
        
        $sql = "INSERT INTO customer (`cuscode`, `prename`,`branch`,`branch_details`, `cus_type` ,`cusname`, `taxnumber`, `idno`,`road`, `province`, cus_doc,
        `pre_subdistrict`,`subdistrict`,pre_district,`district`,`zipcode`, `delidno`,`delroad`, `delprovince`, 
        `pre_delsubdistrict`,`delsubdistrict`,`pre_deldistrict`,`deldistrict`,`delzipcode`, `tel`, `fax`,`contact`, `email`, `county_code` ,`remark`, `active_status`, created_by, created_date) 
        values (:cuscode,:prename,:branch,:branch_details,:cus_type,:cusname,:taxnumber,:idno,:road,:province,:cus_doc,
        :pre_subdistrict,:subdistrict,:pre_district,:district,:zipcode,
        :delidno,:delroad,:delprovince,
        :pre_delsubdistrict,:delsubdistrict,:pre_deldistrict,:deldistrict,:delzipcode,
        :tel,:fax,:contact,:email,:county_code,:remark,'Y',:action_user,:action_date)";
        
        $stmt = $conn->prepare($sql);
        if(!$stmt) throw new PDOException("Insert data error => {$conn->errorInfo()}"); 
        $cus_type= 'ลูกค้าประกัน';
        
        $stmt->bindParam(":cuscode", $cuscode, PDO::PARAM_STR);
        $stmt->bindParam(":prename", $prename, PDO::PARAM_STR);
        $stmt->bindParam(":branch", $branch, PDO::PARAM_STR);
        $stmt->bindParam(":branch_details", $branch_details, PDO::PARAM_STR);
        $stmt->bindParam(":cus_type", $cus_type, PDO::PARAM_STR);
        $stmt->bindParam(":cusname", $cusname, PDO::PARAM_STR);     
        $stmt->bindParam(":taxnumber", $taxnumber, PDO::PARAM_STR);
        $stmt->bindParam(":idno", $idno, PDO::PARAM_STR); 
        $stmt->bindParam(":road", $road, PDO::PARAM_STR);         
        $stmt->bindParam(":province", $province, PDO::PARAM_STR);   
        $stmt->bindParam(":cus_doc", $cus_doc, PDO::PARAM_STR);   
        $stmt->bindParam(":pre_subdistrict", $pre_subdistrict, PDO::PARAM_STR);      
        $stmt->bindParam(":subdistrict", $subdistrict, PDO::PARAM_STR);   
        $stmt->bindParam(":pre_district", $pre_district, PDO::PARAM_STR);      
        $stmt->bindParam(":district", $district, PDO::PARAM_STR);                
        $stmt->bindParam(":zipcode", $zipcode, PDO::PARAM_STR);
        $stmt->bindParam(":delidno", $delidno, PDO::PARAM_STR); 
        $stmt->bindParam(":delroad", $delroad, PDO::PARAM_STR);         
        $stmt->bindParam(":delprovince", $delprovince, PDO::PARAM_STR);   
        $stmt->bindParam(":pre_delsubdistrict", $pre_delsubdistrict, PDO::PARAM_STR);      
        $stmt->bindParam(":delsubdistrict", $delsubdistrict, PDO::PARAM_STR);   
        $stmt->bindParam(":pre_deldistrict", $pre_deldistrict, PDO::PARAM_STR);      
        $stmt->bindParam(":deldistrict", $deldistrict, PDO::PARAM_STR);                
        $stmt->bindParam(":delzipcode", $delzipcode, PDO::PARAM_STR);        
        $stmt->bindParam(":tel", $tel, PDO::PARAM_STR);
        $stmt->bindParam(":fax", $fax, PDO::PARAM_STR);
        $stmt->bindParam(":contact", $contact, PDO::PARAM_STR);        
        $stmt->bindParam(":email", $email, PDO::PARAM_STR);     
        $stmt->bindParam(":county_code", $county_code, PDO::PARAM_STR);       
        $stmt->bindParam(":remark", $remark, PDO::PARAM_STR);        
        $stmt->bindParam(":action_user", $action_user, PDO::PARAM_INT); 
        $stmt->bindParam(":action_date", $action_date, PDO::PARAM_STR);  

        if(!$stmt->execute()) {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }

        $conn->commit();
        $strSQL = "UPDATE cuscode SET ";
        $strSQL .= " number= number+1 ";
        $strSQL .= " order by id desc LIMIT 1 ";

        $stmt3 = $conn->prepare($strSQL);
        if ($stmt3->execute()) {
            http_response_code(200);
            echo json_encode(array("data"=> array("id" => "ok", 'message' => 'เพิ่มลูกค้าประกันสำเร็จ')));
        }
        else
        {
            $error = $conn->errorInfo();
            throw new PDOException("Insert data error => $error");
            die;
        }    

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
