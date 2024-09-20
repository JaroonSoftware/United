<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set('Asia/Bangkok');
session_start();
// include('../../conn.php');
include('../conn.php');
include('../src/JWT.php');
include_once(dirname(__FILE__, 2) . "/common/fnc-code.php");

use Firebase\JWT\JWT; 
// $db = new DbConnect;
// $conn = $db->connect();

$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

if (!isset($_POST['username'], $_POST['password'])) {
	exit($_POST['username']);
}

$sql = 'SELECT firstname,lastname,code,password,type,active_status FROM user WHERE username = :username';
$stmt = $conn->prepare($sql);
$stmt->bindParam(':username', $_POST["username"]);
// $stmt->execute(); 
if ($stmt->execute()) {
	if ($stmt->rowCount() > 0) {
		$res = $stmt->fetch(PDO::FETCH_ASSOC);
		extract($res, EXTR_OVERWRITE, "_");
		// $stmt->bindValue($firstname,$lastname,$code,$password,$type,$status);
		// Account exists, now we verify the password.
		// Note: remember to use password_hash in your registration file to store the hashed passwords.
		if (password_verify($_POST['password'], $password)) {
			if ($active_status == 'Y') {
				// session_regenerate_id();
				$sKey = base64_encode(vsprintf('C%s%s-%s', str_split(bin2hex(random_bytes(16)), 4)));
				$_SESSION['loggedin'] = TRUE;
				$_SESSION['name'] = $_POST['username'];
				$_SESSION['id'] = $code;
				$_SESSION['firstname'] = $firstname;
				$_SESSION['lastname'] = $lastname;
				$_SESSION['type'] = $type;
				$_SESSION['skey'] = "{$sKey}Jaroon";
				$secretKey = "A3ZjYzAyYmNiLTQxplk=Jaroon"; // ?? 'bGS6lzFqvvSQ8ALbOxatm7/Vk7mLQyzqaS34Q4oR1ew=';   
				$issuedAt = new DateTimeImmutable(); 
				
				$role_allow_edit = in_array($type, ['Admin', 'กรรมการ', 'ผู้จัดการสาขา']);

				$expire = $issuedAt->modify('+1 day');      // Add 60 seconds
				$serverName = "united";
				$username = $_POST['username'];
				$userid = $code;
				$data = [
					'iat'  => $issuedAt->getTimestamp(),         // Issued at: time when the token was generated
					'iss'  => $serverName,                       // Issuer
					'nbf'  => $issuedAt->getTimestamp(),         // Not before
					'exp'  => $expire->getTimestamp(), 			 // Expire
					'username' => $username,                     // User name
					'userid' => $userid,                         // User Id
					'firstname' => $firstname,                   // First Name
					'lastname' => $lastname,                     // Last Name
					'type' => $type,                         	 // User Type
					'expd' => $expire, //test
					'role_allow_edit' => $role_allow_edit //test
				];

				$jwt = JWT::encode($data, $secretKey, 'HS512');

				$year = date("Y");
    			$month = date("m");

				$sql = "select * from options where year = :y and month = :m";
				$stmt = $conn->prepare($sql); 
				if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
					$error = $conn->errorInfo();
					http_response_code(401);
					throw new PDOException("Geting code error => $error");
				}

				$result = $stmt->fetch(PDO::FETCH_ASSOC);

				if (empty($result)) {
					create_options($conn, $year, $month);					
				} 
				// echo 'Welcome ' . $_SESSION['name'] . '!';
				echo json_encode(array('status' => '1', 'message' => 'สำเร็จ', "token" => $jwt));
			} else {
				echo json_encode(array('status' => '0', 'message' => 'User นี้ถูกยกเลิกการใช้งานแล้ว'));
			}
		} else {
			echo json_encode(array('status' => '0', 'message' => 'Password ไม่ถูกต้อง'));
		}
	} else {
		// $stmt->debugDumpParams();
		echo json_encode(array('status' => '0', 'message' => 'Username ไม่ถูกต้อง'));
	}
}else {
	// $stmt->debugDumpParams();
	echo json_encode(array('status' => '0', 'message' => 'ไม่สามารถ Connect Database ได้'));
}
