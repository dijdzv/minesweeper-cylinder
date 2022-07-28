<?php
require_once './func.php';

$play_time_list = readTxtFile('./txt/playTime.txt');
$json_play_time_list = json_encode($play_time_list);

$visit_time_list = readTxtFile('./txt/visitTime.txt');
$json_visit_time_list = json_encode($visit_time_list);

// $ranking_time_list = readTxtFile('./txt/rankingTime.txt');
// $json_ranking_time_list = json_encode($ranking_time_list);


$c_width = $_GET['winWidth'] - 15;
$c_height = $_GET['winHeight'] - 25;

?>

<!DOCTYPE html>
<html lang="js">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="js/statistics.js" defer></script>
  <title>統計-プレイ回数</title>
  <style>
    body {
      background-color: cornsilk;
    }

    canvas {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
    }

    #standard {
      position: absolute;
      width: <?php echo $c_width; ?>px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -<?php echo $c_height / 2; ?>px);
    }

    #standard2 {
      position: absolute;
      height: <?php echo $c_height; ?>px;
      top: 50%;
      left: 50%;
      transform: translate(<?php echo $c_height / 2; ?>px, -50%);
    }

    #standard3 {
      position: absolute;
      width: 60px;
      top: 50%;
      left: 50%;
      transform: translate(<?php echo $c_height / 2; ?>px, -<?php echo $c_height / 2; ?>px);
    }

    .wrap {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .leftRight {
      position: absolute;
      top: -5px;
      text-decoration: underline;
      color: gray;
      cursor: pointer;
    }

    .topCenterBtm {
      position: absolute;
      right: -40px;
      text-decoration: underline;
      color: gray;
      cursor: pointer;
    }

    .list {
      position: absolute;
      left: -15px;
      text-decoration: underline;
      color: gray;
      cursor: pointer;
      font-size: 0.9rem;
    }

    #left {
      left: 20%;
    }

    #right {
      right: 20%;
    }

    #top {
      top: 20%;
    }

    #center {
      top: 30%;
    }

    #btm {
      top: 40%;
    }

    #list1 {
      top: -10px;
    }

    /* #list2 {
      top: 10px;
    } */
  </style>
</head>

<body>

  <div id="standard">
    <div class="wrap">
      <p id="left" class="leftRight"></p>
      <p id="right" class="leftRight"></p>
    </div>
  </div>

  <div id="standard2">
    <div class="wrap">
      <p id="top" class="topCenterBtm">Y</p>
      <p id="center" class="topCenterBtm">M</p>
      <p id="btm" class="topCenterBtm">D</p>
    </div>
  </div>

  <div id="standard3">
    <div class="wrap">
      <p id="list1" class="list">訪問回数</p>
      <!-- <p id="list2" class="list r">登録回数</p> -->
    </div>
  </div>

  <canvas id="canvas" width="<?php echo $c_width; ?>px" height="<?php echo $c_height; ?>px"></canvas>

  <script>
    const jsonPlayTimeList = <?php echo $json_play_time_list; ?>;
    const jsonVisitTimeList = <?php echo $json_visit_time_list; ?>;
  </script>
</body>

</html>