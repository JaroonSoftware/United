<?php 
include_once(dirname(__FILE__, 2)."/onload.php");
$db = new DbConnect;
$conn = $db->connect(); 

if ($_SERVER["REQUEST_METHOD"] == "GET"){
    extract($_GET, EXTR_OVERWRITE, "_"); 
    // $type_code = !empty($type) ? "and i.typecode = '$type'" : "";
    try { 
        $res = null;
        
        $sql = "SELECT i.dncode,i.dndate,c.cuscode, c.cusname,c.prename, c.idno, c.road, c.subdistrict, c.district, c.province, c.zipcode,i.doc_status,i.grand_total_price,i.vat
         FROM dnmaster as i inner join `customer` as c on (i.cuscode=c.cuscode) where c.cuscode= '$cuscode' and i.doc_status != 'ยกเลิก' and i.doc_status != 'ออกใบเสร็จรับเงินแล้ว'  ";
            // $type_code
            $stmt = $conn->prepare($sql); 
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC); 
        http_response_code(200);
        echo json_encode(array("data"=>$res));
    } catch (mysqli_sql_exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
        //throw $exception;
    } catch (Exception $e) { 
        http_response_code(400);
        echo json_encode(array('status' => '0', 'message' => $e->getMessage()));
    } finally{
        // Ignore
        
    }    
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}

exit;
?>