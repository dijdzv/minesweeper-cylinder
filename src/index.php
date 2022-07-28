<?php
require_once './func.php';

countNumTxt('./txt/visitNum.txt', 0);
addNowTimeTxt('./txt/visitTime.txt');
?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Vollkorn:ital,wght@0,900;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/index.css" type="text/css">
  <title>Minesweeper</title>
  <script src="js/index.js" defer></script>
</head>

<body class="animate1">
  <div class="wrap">
    <h1>Minesweeper</h1>
    <p>Cylinder</p>
  </div>
  <p>click</p>
</body>

</html>