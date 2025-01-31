<?php 
include_once(dirname(__FILE__, 2)."/onload.php");
$db = new DbConnect;
$conn = $db->connect(); 

if ($_SERVER["REQUEST_METHOD"] == "GET"){
    extract($_GET, EXTR_OVERWRITE, "_"); 
    // $car_model_code = !empty($type) ? "and i.car_model_code = '$type'" : "";
    try { 
        $res = null;
        
        $brand_name = $brand_name!== 'undefined' ? "and b.brand_name like '%$brand_name%'" : "";

        $sql = "SELECT c.car_model_code,c.car_model_name,c.active_status 
        FROM car_model c 
        left join brand b on b.brand_code=c.brand_code
        where c.active_status = 'Y' 
        $brand_name
        ";
            // $car_model_code
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