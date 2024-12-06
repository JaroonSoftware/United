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
    
    $stcode = !empty($stcode) ? "and a.stcode like '%$stcode%'" : "";
    $stname = !empty($stname) ? "and a.stname like '%$stname%'" : "";
    $supcode = !empty($supcode) ? "and a.supcode like '%$supcode%'" : "";
    $supname = !empty($supname) ? "and a.supname like '%$supname%'" : "";
    try {    

        $sql = "SELECT i.stcode,i.stname,i.min ,s.qty
        from items i
        inner join items_stock s on (i.stcode=s.stcode)
        where i.min > s.qty
        $stcode
        $stname
        $supcode
        $supname";

        $stmt = $conn->prepare($sql); 
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);  

        http_response_code(200);
        echo json_encode(array("data"=>$res));
        // echo json_encode(array("data"=>$res,"sql"=>$sql));
        
        
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