<?php
require_once './func.php';

//scaleどこまで実装するか(手動) 1~7 (8は一応)
$implement_scale = 6;

if (isset($_GET['i'])) {
  if (0 < $_GET['i'] && $_GET['i'] < 9) {
    $implement_scale = $_GET['i'];
  }
}

//難易度取得
if (isset($_GET['degreeOfDifficultyBtn'])) {
  if ($_GET['degreeOfDifficultyBtn'] === 'easy') {
    $degree_of_difficulty = 'easy';
    $degree_of_difficulty_value = 6;
  } elseif ($_GET['degreeOfDifficultyBtn'] === 'normal') {
    $degree_of_difficulty = 'normal';
    $degree_of_difficulty_value = 5;
  } elseif ($_GET['degreeOfDifficultyBtn'] === 'hard') {
    $degree_of_difficulty = 'hard';
    $degree_of_difficulty_value = 4;
  }
} else {
  $degree_of_difficulty = 'easy';
  $degree_of_difficulty_value = 6;
}

//盤面の大きさ取得
if (isset($_GET['scaleBtn'])) {
  $scale = (int)$_GET['scaleBtn'];
} else {
  $scale = 10;
}

//現在の難易度の数値表記
$selectedI = 0;
if ($degree_of_difficulty === 'easy') {
  $selectedI = $selectedI + 0;
} elseif ($degree_of_difficulty === 'normal') {
  $selectedI = $selectedI + 1;
} elseif ($degree_of_difficulty === 'hard') {
  $selectedI = $selectedI + 2;
}
if ($scale === 10) {
  $selectedI = $selectedI + 0;
} elseif ($scale === 15) {
  $selectedI = $selectedI + 3;
} elseif ($scale === 20) {
  $selectedI = $selectedI + 6;
} elseif ($scale === 25) {
  $selectedI = $selectedI + 9;
} elseif ($scale === 30) {
  $selectedI = $selectedI + 12;
} elseif ($scale === 35) {
  $selectedI = $selectedI + 15;
} elseif ($scale === 40) {
  $selectedI = $selectedI + 18;
} elseif ($scale === 45) {
  $selectedI = $selectedI + 21;
}
$selected = [];
for ($i = 0; $i < 24; $i++) {
  if ($i !== $selectedI) {
    $selected[] = '';
  } elseif ($i === $selectedI) {
    $selected[] = 'selectedBtn';
  }
}

//ランキングとか-----------------------------------------------------------

//ファイル取得
$file_path = "csv/ranking_{$scale}_{$degree_of_difficulty}.csv";

//追加
if (isset($_GET['rankName']) && $_GET['rankName'] !== '') { //空×空白〇
  $id = createIdCsvRecord($file_path);
  $contents = [$id, $_GET['rankName'], $_GET['rankTime']];
  addCsvRecord($file_path, $contents);

  $row_list = readCsvFile($file_path);

  writeCsvFile($file_path, $row_list);

  //ランキング登録数
  countNumTxt('./txt/rankingNum.txt', 0);

  addNowTimeTxt('./txt/rankingTime.txt');
}

//クリア回数とクリア時間
if (isset($_GET['clearTime'])) {
  countNumTxt('./txt/clearNum.txt', $selectedI);
  $clear_time_list = readCsvFile('./txt/clearTime.csv');
  $clear_time_list[$selectedI][] = $_GET['clearTime'];
  writeCsvFile('./txt/clearTime.csv', $clear_time_list);

  //再読み込み二重登録対策とurlパラメータ
  header('location: ./main.php');
  exit;
}

//ここから読み込みとか生成とかデータ取りとか--------------------------------

//プレイ開始時刻
addNowTimeTxt('./txt/playTime.txt');

//クリア画面で順位を出す->function.js
$score_list = readCsvFile($file_path);
usort($score_list, function ($point_1, $point_2) {
  return $point_1[2] <=> $point_2[2];
});
$json_score_list = json_encode($score_list);

//ランキングエリア用の読み込み
$ranking_file_list = [];
for ($i = 0; $i < $implement_scale; $i++) {
  $index = $i * 5 + 10;
  //------
  $ranking_file = readCsvFile("csv/ranking_{$index}_easy.csv");
  if (count($ranking_file) !== 0) {
    usort($ranking_file, function ($point_1, $point_2) {
      return $point_1[2] <=> $point_2[2];
    });
  }
  while (count($ranking_file) < 100) {
    $ranking_file[] = ['', '', ''];
  }
  $ranking_file_list[] = $ranking_file;
  //-----
  $ranking_file = readCsvFile("csv/ranking_{$index}_normal.csv");
  if (count($ranking_file) !== 0) {
    usort($ranking_file, function ($point_1, $point_2) {
      return $point_1[2] <=> $point_2[2];
    });
  }
  while (count($ranking_file) < 100) {
    $ranking_file[] = ['', '', ''];
  }
  $ranking_file_list[] = $ranking_file;
  //-----
  $ranking_file = readCsvFile("csv/ranking_{$index}_hard.csv");
  if (count($ranking_file) !== 0) {
    usort($ranking_file, function ($point_1, $point_2) {
      return $point_1[2] <=> $point_2[2];
    });
  }
  while (count($ranking_file) < 100) {
    $ranking_file[] = ['', '', ''];
  }
  $ranking_file_list[] = $ranking_file;
}

//地雷の位置を生成
$select_scale = round(($scale * ($scale * 2)) / $degree_of_difficulty_value);

$mine_place = [];
for ($i = 0; $i < $select_scale; $i++) {
  $mine_place[] = 'mine';
}
for ($i = 0; $i < $scale * ($scale * 2) - $select_scale; $i++) {
  $mine_place[] = '';
}
shuffle($mine_place);

//盤面の配列に配置
for ($i = 0; $i < $scale; $i++) {
  ${"row_" . $i} = [];
  for ($j = 0; $j < $scale * 2; $j++) {
    ${"row_" . $i}[$j][0] = ($i * $scale) +  $j;
    ${"row_" . $i}[$j][1] = '';
    ${"row_" . $i}[$j][2] = $mine_place[($i * $scale) + $j];
  }
}

$board = [];
for ($i = 0; $i < $scale; $i++) {
  $board[$i] = ${"row_" . $i};
}

//総プレイ回数と読み込み
countNumTxt('./txt/playNum.txt', $selectedI);
$play_num_list = readTxtFile('./txt/playNum.txt');
$play_num = 0;
for ($i = 0; $i < count($play_num_list); $i++) {
  $play_num += $play_num_list[$i];
}
while (count($play_num_list) < $implement_scale * 3) {
  $play_num_list[] = 0;
}

$clear_num_list = readTxtFile('./txt/clearNum.txt');
$clear_num = 0;
for ($i = 0; $i < count($clear_num_list); $i++) {
  $clear_num += $clear_num_list[$i];
}
while (count($clear_num_list) < $implement_scale * 3) {
  $clear_num_list[] = 0;
}

$clearance_rate = [];
for ($i = 0; $i < $implement_scale * 3; $i++) {
  if ((int)$play_num_list[$i] !== 0) {
    $clearance_rate[$i] = $clear_num_list[$i] / $play_num_list[$i] * 100;
  } else {
    $clearance_rate[$i] = 0;
  }
}

//平均クリアタイム読み込み
$clear_time_list = readCsvFile('./txt/clearTime.csv');
$clear_Avg_time_list = [];
for ($i = 0; $i < $implement_scale * 3; $i++) {
  $sum_time = 0;
  for ($j = 0; $j < count($clear_time_list[$i]); $j++) {
    $sum_time += $clear_time_list[$i][$j];
  }
  if ($sum_time !== 0) {
    $avg_sec = $sum_time / (count($clear_time_list[$i]) - 1);
    $clear_Avg_time_list[] = round($avg_sec / 3600 * 100) / 100;
  } else {
    $clear_Avg_time_list[] = '&#65311;';
  }
}
?>

<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome-animation/0.0.10/font-awesome-animation.css" type="text/css" media="all" />
  <link rel="stylesheet" href="css/main.css">
  <script src="js/declaration.js" defer></script>
  <script src="js/function.js" defer></script>
  <script src="js/login.js" defer></script>
  <script src="js/ranking.js" defer></script>
  <script src="js/info.js" defer></script>
  <script src="js/setting.js" defer></script>
  <script src="js/main.js" defer></script>
  <title>Minesweeper Cylinder</title>
</head>

<body>
  <section id="start">
    <div id="startBlock">
      <p class="startP">START</p>
      <p class="startP">click</p>
    </div>
  </section>


  <main id="wrapAll">

    <section id="wrapLeft">
      <i class="far fa-eye-slash"></i>
      <div id="wrapDifficulty">
        <i class="far fa-eye"></i>
        <?php for ($i = 0; $i < $implement_scale; $i++) { ?>
          <div class="wrapDegreeOfDifficulty">
            <p><?php echo $i * 5 + 10; ?>&#215;<?php echo ($i * 5 + 10) * 2; ?></p>
            <form action="./main.php" method="get" class="wrapDegreeOfDifficultyBtn">
              <button type="submit" name='degreeOfDifficultyBtn' value="easy" class="degreeOfDifficultyBtn <?php echo $selected[$i * 3]; ?>" title="クリア率<?php echo round($clearance_rate[$i * 3]); ?>%&#13;&#10;平均クリアタイム<?php echo $clear_Avg_time_list[$i * 3]; ?>時間">easy</button>
              <button type="submit" name='degreeOfDifficultyBtn' value="normal" class="degreeOfDifficultyBtn <?php echo $selected[$i * 3 + 1]; ?>" title="クリア率<?php echo round($clearance_rate[$i * 3 + 1]); ?>%&#13;&#10;平均クリアタイム<?php echo $clear_Avg_time_list[$i * 3 + 1]; ?>時間">normal</button>
              <button type="submit" name='degreeOfDifficultyBtn' value="hard" class="degreeOfDifficultyBtn <?php echo $selected[$i * 3 + 2]; ?>" title="クリア率<?php echo round($clearance_rate[$i * 3 + 2]); ?>%&#13;&#10;平均クリアタイム<?php echo $clear_Avg_time_list[$i * 3 + 2]; ?>時間">hard</button>
              <input type="hidden" name="scaleBtn" value="<?php echo $i * 5 + 10; ?>">
            </form>
          </div> <!-- /wrapDegreeOfDifficulty -->
        <?php } ?>
      </div>
    </section> <!-- /wrapLeft -->


    <section id="wrapTop">
      <div id="sizeBox" class="faa-parent animated-hover">
        <?php echo $scale; ?><i class="fas fa-times fa-fw faa-spin faa-slow"></i><?php echo $scale * 2; ?>
      </div>
      <div id="elapsedTimeBox" class="faa-parent animated-hover" title="表記変更可能">
        <i class="far fa-hourglass faa-wrench faa-slow"></i><span id="elapsedTime">0</span>
        <p id="addTimeObj"></p>
      </div>
      <div id="flagCountBox" class="faa-parent animated-hover">
        <i class="far fa-flag faa-vertical faa-slow"></i><span id="flagCount">0</span>
      </div>
      <div id="mineCountBox" class="faa-parent animated-hover">
        <i class="fas fa-skull-crossbones faa-tada"></i><?php echo $select_scale; ?>
      </div>
    </section> <!-- wrapTop -->


    <section id="wrapCenter">
      <i class="fas fa-info-circle"></i>
      <div id="infoModal">
        <p id="infoTitle">基本ルール</p>
        <ul>
          <li>左クリックでマスを開けます。</li>
          <li>右クリックでマスに旗を立てます。<br>再度右クリックすることで旗を外せます。</li>
          <li>地雷が埋まっているマス(以下危険マス)を開けると<strong><em>「GAME END」</em></strong>です。</li>
          <li>地雷が埋まっていないマス(以下安全マス)を開けると、周囲8マス(以下周囲マス)に危険マスがある場合その数を表示し、周囲マスに危険マスが無い場合は危険マスが存在するまで周囲マスを自動で開けます。</li>
          <li>安全マスを全て開けると<strong><em>「GAME CLEAR」</em></strong>です。</li>
        </ul>
        <p id="infoSubTitle">Tips</p>
        <ul>
          <li>ドラッグ及び<em>「Cylinder」</em>左右の矢印をクリックすることで、<em>「Cylinder」</em>を回転させることができます。</li>
          <li><i class="fas fa-hand-holding-heart"></i>ボタンを押すと安全マスの中からランダムに1つ開けます。<br>始めは+10秒のペナルティが発生し、回数を増すごとに+20,+30と比例的にペナルティが増加します。</li>
          <li>画面上部の経過時間を表示するエリアをクリックすると、「日時分秒」表示に切り変えることができ、再度押すことで「秒」表示に戻すことができます。</li>
          <li>画面左部の難易度選択のボタンにカーソルを乗せると、「クリア率」と「平均クリアタイム」を知ることができます。</li>
        </ul>
      </div>
      <i class="fas fa-share" id="leftArrow"></i>
      <div id="board">
        <!-- <div class="top"></div> -->
        <?php foreach ($board as $row) { ?>
          <div class="row row<?php echo $scale; ?>">
            <?php foreach ($row as $square) { ?>
              <div class="square basis <?php echo $square[2]; ?> square<?php echo $scale; ?>">
                <?php echo $square[1]; ?>
              </div>
            <?php } ?>
          </div>
        <?php } ?>
        <!-- <div class="btm"></div> -->
      </div> <!-- /board -->
      <i class="fas fa-reply" id="rightArrow"></i>
      <div id="wrapBtn">
        <button type="button" id="resetBtn" title="地雷を再配置"><i class="fas fa-redo"></i></button>
        <button type="button" id="openBtn" title="お助け機能&#65306;地雷が存在していないマスの中からランダムに1つ開ける"><i class="fas fa-hand-holding-heart"></i></button>
        <button type="button" id="modeBtn" title="マス開けと旗立てを入れ替える"><i class="fas fa-exchange-alt"></i></button>
      </div> <!-- /wrapBtn -->
    </section> <!-- /wrapCenter -->


    <section id="wrapRight">
      <div id="wrapLogin">
        <button type="button" id="loginBtn">ログイン</button>
        <p id="highestRank">最高順位&#65306;</p>
      </div>
      <!-- loginModal -->
      <div id="loginModal">
        <div id="wrapLoginInput">
          <i class="fas fa-edit"></i>
          <input type="text" id="inputLoginName" placeholder="任意の名前でログイン" autocomplete="off" spellcheck="false">
          <button type="submit" class="submitBtn" title="ログイン不可" disabled><i class="fas fa-sign-in-alt"></i></button>
        </div>
        <div id="wrapLoginBtn">
          <button type="submit" class="submitBtn" title="ログイン不可" disabled><i class="fas fa-sign-in-alt"></i>&nbsp;ログイン</button>
          <button type="button" id="removeBtn" title="ログアウト" disabled><i class="fas fa-sign-out-alt"></i>&nbsp;ログアウト</button>
        </div>
        <ul>
          <li>ブラウザを開いている限り情報は保持されます</li>
          <li>1&#xFF5E;10文字</li>
          <li>空白不可</li>
        </ul>
      </div>
      <!-- /loginModal -->
      <button type="button" id="settingBtn"><i class="fas fa-cog"></i></button>
      <!-- settingModal -->
      <div id="settingModal">
        <p id="sensitivityTitle">回転感度&#65306;<span id="sensitivityVal">2.0</span></p>
        <input type="range" id="sensitivityBar" min="0.1" max="10" step="0.1" value="2">
        <div id="wrapStatistics">
          <p id="statisticsTitle">統計 &#45; データ</p>
          <div id="wrapTotalBox">
            <div class="totalBox">
              <p class="totalTitle">総訪問数</p>
              <p class="totalNum"><?php echo readTxtFile('./txt/visitNum.txt')[0]; ?>回</p>
            </div>
            <div class="totalBox">
              <p class="totalTitle">総プレイ数</p>
              <p class="totalNum"><?php echo $play_num; ?>回</p>
            </div>
            <div class="totalBox">
              <p class="totalTitle">総クリア数</p>
              <p class="totalNum"><?php echo $clear_num; ?>回</p>
            </div>
            <div class="totalBox">
              <p class="totalTitle">総ランキング登録数</p>
              <p class="totalNum"><?php echo readTxtFile('./txt/rankingNum.txt')[0]; ?>回</p>
            </div>
          </div>
          <button id="anchorStatistics"><i class="fas fa-chart-bar"></i>グラフ閲覧ページへ</button>
          <p id="advice">別ウィンドウが開きます</p>
        </div>
      </div>
      <!-- /settingModal -->
      <i class="far fa-eye-slash"></i>
      <div id="rankingList">
        <i class="far fa-eye"></i>
        <div id="wrapRankingBtn">
          <div id="wrapRankingDegreeOfDifficultyBtn">
            <button type="button" value="easy" class="rankingDegreeOfDifficultyBtn">easy</button>
            <button type="button" value="normal" class="rankingDegreeOfDifficultyBtn">normal</button>
            <button type="button" value="hard" class="rankingDegreeOfDifficultyBtn">hard</button>
          </div>
          <div id="wrapRankingScaleBtn">
            <?php for ($i = 0; $i < $implement_scale; $i++) { ?>
              <button type="button" value="<?php echo $i * 5 + 10; ?>" class="rankingScaleBtn">
                <?php echo $i * 5 + 10; ?>
              </button>
            <?php } ?>
          </div>
        </div>
        <table id="tableHeader">
          <tr>
            <th>rank</th>
            <th>name</th>
            <th>score</th>
          </tr>
        </table>
        <div id="wrapRankingTable">
          <?php foreach ($ranking_file_list as $ranking_file) { ?>
            <table class="rankingTable">
              <?php for ($i = 0; $i < 100; $i++) { ?>
                <tr>
                  <td><?php echo $i + 1; ?></td>
                  <td><?php echo htmlspecialchars($ranking_file[$i][1], ENT_QUOTES); ?></td>
                  <td><?php echo $ranking_file[$i][2]; ?></td>
                </tr>
              <?php } ?>
            </table>
          <?php } ?>
        </div>
      </div> <!-- /rankingList -->
    </section> <!-- /wrapRight -->

  </main> <!-- /wrapAll -->

  <section id="gameEnd">
    <div id="endBlock">
      <p class="endP">GAME END</p>
      <p class="endP">click</p>
    </div>
  </section>

  <section id="gameClear">
    <div id="clearBlock">
      <p class="clearP">GAME CLEAR</p>
      <p class="clearP">click or register</p>
    </div>
    <div id="rankingModal">
      <p>記録 <span id="time"></span>秒</p>
      <p>順位 <span id="rank"></span>位</p>
      <form action="./main.php" method="get">
        <i class="fas fa-edit"></i>
        <input type="text" name="rankName" placeholder="任意の名前で登録" autocomplete="off" spellcheck="false">
        <input type="hidden" name="rankTime">
        <button type="submit" id="registerBtn" disabled>登録</button>
        <input type="hidden" name="degreeOfDifficultyBtn" value="<?php echo $degree_of_difficulty ?>">
        <input type="hidden" name="scaleBtn" value="<?php echo $scale; ?>">
        <input type="hidden" name="clearTime" value="">
      </form>
      <ul>
        <li>1&#xFF5E;10文字</li>
        <li>空白不可</li>
      </ul>
    </div>
  </section>

  <!-- jsへ受け渡し -->
  <script>
    const implementScale = <?php echo $implement_scale; ?>;
    const degreeOfDifficultyName = '<?php echo $degree_of_difficulty; ?>';
    const scaleVal = <?php echo $scale; ?>;

    const jsonScoreList = <?php echo $json_score_list; ?>;
  </script>
</body>

</html>

<!--  todo
更新するときは全部入れなおす

localhost/sample/creation/minesweeper
localhost/sample/creation/minesweeper/main.php
 -->