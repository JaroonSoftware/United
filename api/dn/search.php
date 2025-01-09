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

    $dncode = !empty($dncode) ? "and a.dncode like '%$dncode%'" : "";
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
    $dndate = "";
    if( !empty($dndate_form) && !empty($dndate_to) ) {
        $dndate = "and date_format( a.dndate, '%Y-%m-%d' ) >= '$dndate_form' and date_format( a.dndate, '%Y-%m-%d' ) <= '$dndate_to' ";
    } 

    $condition = "$dncode
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
    $dndate";
    
    try {   
        $sql = " 
        SELECT
        DISTINCT a.dncode,
        a.*,
        c.*,
        co.county_name,
        concat(u.firstname, ' ', u.lastname) created_name
        from dnmaster a       
        inner join dndetail d on a.dncode = d.dncode
        left join items i on i.stcode = d.stcode
        left join items_type t on i.type_code = t.type_code
        left join kind k on k.kind_code = i.kind_code
        left join car_model cm on cm.car_model_code = i.car_model_code
        left join brand b on cm.brand_code = b.brand_code 
        left join customer c on a.cuscode = c.cuscode   
        left join county co on co.county_code = c.county_code                
        left join user u on a.created_by = u.code
        where 1 = 1 
        $condition
        order by a.dncode desc ;";


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