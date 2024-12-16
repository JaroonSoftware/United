<?php
#region Update Code
function update_pocode($pdo){
    $year = date("Y");
    $month = date("m");
    $sql = "update options set pocode = pocode + 1 where year = :y and month = :m";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Update code error => $error");
    }
}

function update_grcode($pdo){
    $year = date("Y");
    $month = date("m");
    $sql = "update options set grcode = grcode + 1 where year = :y and month = :m";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Update code error => $error");
    }
}

function update_qtcode($pdo){
    $year = date("Y");
    $month = date("m");
    $sql = "update options set qtcode = qtcode + 1 where year = :y and month = :m";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Update code error => $error");
    }
} 

function update_socode($pdo){
    $year = date("Y");
    $month = date("m");
    $sql = "update options set socode = socode + 1 where year = :y and month = :m";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Update code error => $error");
    }
} 

function update_ivcode($pdo){
    $year = date("Y");
    $month = date("m");
    $sql = "update options set ivcode = ivcode + 1 where year = :y and month = :m";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Update code error => $error");
    }
} 

function update_recode($pdo){
    $year = date("Y");
    $month = date("m");
    $sql = "update options set recode = recode + 1 where year = :y and month = :m";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Update code error => $error");
    }
} 


function update_dncode($pdo){
    $year = date("Y");
    $month = date("m");
    $sql = "update options set dncode = dncode + 1 where year = :y and month = :m";
    $stmt = $pdo->prepare($sql);

    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Update code error => $error");
    }
} 
#endregion
 
#region Request Code
function request_pocode($pdo ){
    $year = date("Y");
    $month = date("m");

    $sql = "select pocode code from options where year = :y and month = :m";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo();
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($result)) {
        create_options($pdo, $year, $month);
        return 0;
    } 
    //EST24010001
    $res = $result["code"];
    $y = date("y");
    $m = date("m");
    $number = intval($res);
    $prefix = "PO$y$m";
    while(true){
        $code = sprintf("%04s", ( $number) );
        $format = $prefix.$code;
        $sql = "SELECT 1 r FROM pomaster where pocode = '$format'"; 
        $stmt = $pdo->prepare($sql); 
        $stmt->execute(); 
        if ($stmt->rowCount() > 0){
            $number += 1;
            update_pocode($pdo);
            continue;
        } else break;
    } 
    return $prefix.sprintf("%04s", ( $number) );   
}

function request_grcode($pdo ){
    $year = date("Y");
    $month = date("m");

    $sql = "select grcode code from options where year = :y and month = :m";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo();
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($result)) {
        create_options($pdo, $year, $month);
        return 0;
    } 
    //EST24010001
    $res = $result["code"];
    $y = date("y");
    $m = date("m");
    $number = intval($res);
    $prefix = "GR$y$m";
    while(true){
        $code = sprintf("%04s", ( $number) );
        $format = $prefix.$code;
        $sql = "SELECT 1 r FROM grmaster where grcode = '$format'"; 
        $stmt = $pdo->prepare($sql); 
        $stmt->execute(); 
        if ($stmt->rowCount() > 0){
            $number += 1;
            update_pocode($pdo);
            continue;
        } else break;
    } 
    return $prefix.sprintf("%04s", ( $number) );   
}

function request_qtcode($pdo){
    $year = date("Y");
    $month = date("m");

    $sql = "select qtcode code from options where year = :y and month = :m";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo();
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($result)) {
        create_options($pdo, $year, $month);
        return 0;
    } 
    //QU240100001
    $res = $result["code"];
    $y = substr( date("Y")+543, -2);
    $m = date("m");
    $number = intval($res);
    $prefix = "QT$y$m";
    while(true){
        $code = sprintf("%04s", ( $number) );
        $format = $prefix.$code;
        $sql = "SELECT 1 r FROM qtmaster where qtcode = '$format'"; 
        $stmt = $pdo->prepare($sql); 
        $stmt->execute(); 
        if ($stmt->rowCount() > 0){
            $number += 1;
            update_qtcode($pdo);
            continue;
        } else break;
    } 
    return $prefix.sprintf("%04s", ( $number) );   
}

function request_socode($pdo){
    $year = date("Y");
    $month = date("m");

    $sql = "select socode code from options where year = :y and month = :m";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo();
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($result)) {
        create_options($pdo, $year, $month);
        return 0;
    } 
    //QU240100001
    $res = $result["code"];
    $y = substr( date("Y")+543, -2);
    $m = date("m");
    $number = intval($res);
    $prefix = "SO$y$m";
    while(true){
        $code = sprintf("%04s", ( $number) );
        $format = $prefix.$code;
        $sql = "SELECT 1 r FROM somaster where socode = '$format'"; 
        $stmt = $pdo->prepare($sql); 
        $stmt->execute(); 
        if ($stmt->rowCount() > 0){
            $number += 1;
            update_socode($pdo);
            continue;
        } else break;
    } 
    return $prefix.sprintf("%04s", ( $number) );   
}

function request_ivcode($pdo){
    $year = date("Y");
    $month = date("m");

    $sql = "select ivcode code from options where year = :y and month = :m";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo();
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($result)) {
        create_options($pdo, $year, $month);
        return 0;
    } 
    //QU240100001
    $res = $result["code"];
    $y = substr( date("Y")+543, -2);
    $m = date("m");
    $number = intval($res);
    $prefix = "IV$y$m";
    while(true){
        $code = sprintf("%04s", ( $number) );
        $format = $prefix.$code;
        $sql = "SELECT 1 r FROM iv_master where ivcode = '$format'"; 
        $stmt = $pdo->prepare($sql); 
        $stmt->execute(); 
        if ($stmt->rowCount() > 0){
            $number += 1;
            update_ivcode($pdo);
            continue;
        } else break;
    } 
    return $prefix.sprintf("%04s", ( $number) );   
}

function request_recode($pdo){
    $year = date("Y");
    $month = date("m");

    $sql = "select recode code from options where year = :y and month = :m";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo();
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($result)) {
        create_options($pdo, $year, $month);
        return 0;
    } 
    //QU240100001
    $res = $result["code"];
    $y = substr( date("Y")+543, -2);
    $m = date("m");
    $number = intval($res);
    $prefix = "U$y$m";
    while(true){
        $code = sprintf("%04s", ( $number) );
        $format = $prefix.$code;
        $sql = "SELECT 1 r FROM receipt where recode = '$format'"; 
        $stmt = $pdo->prepare($sql); 
        $stmt->execute(); 
        if ($stmt->rowCount() > 0){
            $number += 1;
            update_recode($pdo);
            continue;
        } else break;
    } 
    return $prefix.sprintf("%04s", ( $number) );   
}

function request_dncode($pdo){
    $year = date("Y");
    $month = date("m");

    $sql = "select dncode code from options where year = :y and month = :m";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo();
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (empty($result)) {
        create_options($pdo, $year, $month);
        return 0;
    } 
    //QU240100001
    $res = $result["code"];
    $y = substr( date("Y")+543, -2);
    $m = date("m");
    $number = intval($res);
    $prefix = "DN$y$m";
    while(true){
        $code = sprintf("%04s", ( $number) );
        $format = $prefix.$code;
        $sql = "SELECT 1 r FROM dnmaster where dncode = '$format'"; 
        $stmt = $pdo->prepare($sql); 
        $stmt->execute(); 
        if ($stmt->rowCount() > 0){
            $number += 1;
            update_dncode($pdo);
            continue;
        } else break;
    } 
    return $prefix.sprintf("%04s", ( $number) );   
}
#endregion

function create_options($pdo, $year, $month){
    $sql = "insert into options (year, month) values ( :y, :m)";
    $stmt = $pdo->prepare($sql); 
    if (!$stmt->execute([ 'y' => $year, 'm' => $month ])){
        $error = $pdo->errorInfo(); 
        http_response_code(401);
        throw new PDOException("Geting code error => $error");
    }
}