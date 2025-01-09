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
    
    $socode = !empty($socode) ? "and a.socode like '%$socode%'" : "";
    $stname = !empty($stname) ? "and i.stname like '%$stname%'" : "";
    $cuscode = !empty($cuscode) ? "and c.cuscode like '%$cuscode%'" : "";
    $cusname = !empty($cusname) ? "and c.cusname like '%$cusname%'" : "";
    $type_name = !empty($type_name) ? "and t.type_name like '%$type_name%'" : "";
    $kind_name = !empty($kind_name) ? "and k.kind_name like '%$kind_name%'" : "";
    $brand_name = !empty($brand_name) ? "and b.brand_name like '%$brand_name%'" : "";
    $car_model_name = !empty($car_model_name) ? "and cm.car_model_name like '%$car_model_name%'" : "";
    $year = !empty($year) ? "and cm.year like '%$year%'" : "";    
    $car_no = !empty($car_no) ? "and a.car_no like '%$car_no%'" : "";
    $created_by = !empty($created_by) ? "and ( u.firstname like '%$created_by%' or u.lastname like '%$created_by%' )" : "";
    $sodate = "";
    if( !empty($sodate_form) && !empty($sodate_to) ) {
        $sodate = "and date_format( a.sodate, '%Y-%m-%d' ) >= '$sodate_form' and date_format( a.sodate, '%Y-%m-%d' ) <= '$sodate_to' ";
    } 

    $condition = "$socode
    $stname
    $cuscode
    $cusname
    $type_name
    $kind_name
    $brand_name
    $car_model_name
    $year
    $car_no
    $created_by
    $sodate";
    
    try {   
        $sql = " 
        SELECT
        DISTINCT a.socode,
        a.*,
        c.*,
        concat(u.firstname, ' ', u.lastname) created_name
        from somaster a        
        inner join sodetail d on a.socode = d.socode
        left join items i on i.stcode = d.stcode
        left join items_type t on i.type_code = t.type_code
        left join kind k on k.kind_code = i.kind_code
        left join car_model cm on cm.car_model_code = i.car_model_code
        left join brand b on cm.brand_code = b.brand_code
        left join customer c on a.cuscode = c.cuscode        
        left join user u on a.created_by = u.code
        where 1 = 1 
        $condition
        order by a.socode desc ;";


        $stmt = $conn->prepare($sql); 
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);  

        http_response_code(200);
        echo json_encode(array("data"=>$res));
        // echo json_encode(array("data" => $res,"sql" => $sql));
        
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