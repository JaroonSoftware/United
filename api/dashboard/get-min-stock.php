<?php
ob_start(); 
include_once(dirname(__FILE__, 2)."/onload.php");
http_response_code(400);
$db = new DbConnect;
$conn = $db->connect();

if ($_SERVER["REQUEST_METHOD"] == "POST"){
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);

    extract($_POST, EXTR_OVERWRITE, "_");   
    
    $stcode = !empty($stcode) ? "and i.stcode like '%$stcode%'" : "";
    $stname = !empty($stname) ? "and i.stname like '%$stname%'" : "";
    $supcode = !empty($supcode) ? "and i.supcode like '%$supcode%'" : "";
    $supname = !empty($supname) ? "and sup.supname like '%$supname%'" : "";
    try {    

        $sql = "SELECT i.stcode,i.stname,i.min ,s.qty,sup.supname,sum(p.qty)-sum(IF(p.recamount IS NULL,0,p.recamount)) as qty_po
        from items i
        inner join items_stock s on (i.stcode=s.stcode)
        left outer join supplier sup on (i.supcode=sup.supcode)
        left outer join podetail p on (s.stcode=p.stcode) and (p.qty>IF(p.recamount IS NULL,0,p.recamount))
        where 1=1
        $stcode
        $stname
        $supcode
        $supname
        GROUP by i.stcode
		HAVING  i.min > s.qty + IF(sum(p.qty)-sum(IF(p.recamount IS NULL,0,p.recamount)) IS NULL,0,sum(p.qty)-sum(IF(p.recamount IS NULL,0,p.recamount)))
		order by i.stcode";

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
        $conn = null;
        
    }    
} else {
    http_response_code(400);
    echo json_encode(array('status' => '0', 'message' => 'request method fail.'));
}
ob_end_flush(); 
exit;
?>