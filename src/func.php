<?php
/* csv----------------------------------------------------- */

/**
 * csvファイルにレコードを追加する
 *
 * @param  string $file_path ファイルパス
 * @param  array  $contents  追加する配列
 * @return void
 */
function addCsvRecord($file_path, $contents)
{
  $fp = fopen($file_path, 'a');
  fputs($fp, implode(',', $contents) . "\r\n");
  fclose($fp);
}

/**
 * csvファイルを読み込み配列に格納する
 *
 * @param  string $file_path ファイルパス
 * @return array             配列化したcsvファイル
 */
function readCsvFile($file_path)
{
  $fp = fopen($file_path, 'r');
  $row_list = [];
  while ($row = fgets($fp)) {
    $row = str_replace("\r", '', $row);
    $row = str_replace("\n", '', $row);
    $row_list[] = explode(',', $row);
  }
  fclose($fp);
  return $row_list;
}

/**
 * csvファイルを上書きする
 *
 * @param  string $file_path ファイルパス
 * @param  array  $row_list  上書きする配列
 * @return void
 */
function writeCsvFile($file_path, $row_list)
{
  $fp = fopen($file_path, 'w');
  foreach ($row_list as $row) {
    fputs($fp, implode(',', $row) . "\r\n");
  }
  fclose($fp);
}

/**
 * 指定したidのレコードを削除する
 *
 * @param  string $file_path ファイルパス
 * @param  int    $id        指定するid
 * @return void
 */
function delCsvRecord($file_path, $id)
{
  $row_list = readCsvFile($file_path);
  foreach ($row_list as $key => $row) {
    if ((int)$row[0] === $id) {
      unset($row_list[$key]);
      writeCsvFile($file_path, $row_list);
      return;
    }
  }
}

/**
 * 指定したidとカラム番号のデータを指定したデータに書き換える
 *
 * @param  string     $file_path ファイルパス
 * @param  int        $id        指定するid
 * @param  int        $colNum    指定するカラム番号
 * @param  int|string $editedVal 編集後の値
 * @return void
 */
function editCsvData($file_path, $id, $colNum, $editedVal)
{
  $row_list = readCsvFile($file_path);
  foreach ($row_list as $key => $row) {
    if ((int)$row[0] === $id) {
      $row_list[$key][$colNum] = $editedVal;
      writeCsvFile($file_path, $row_list);
      return;
    }
  }
}

/**
 * レコードに付加するidを生成する
 *
 * @param  string $file_path ファイルパス
 * @return int               付加するid
 */
function createIdCsvRecord($file_path)
{
  $row_list = readCsvFile($file_path);
  $max = 0;
  foreach ($row_list as $row) {
    if ($max < $row[0]) {
      $max = $row[0];
    }
  }
  $id = $max + 1;
  return $id;
}

/**
 * 2次元配列から1次元配列を抜き取る
 *
 * @param  array $row_list 抜き取られる2次元配列
 * @param  int   $colNum   抜き取りたいカラム番号
 * @return array           抜き取られた1次元配列
 */
function twoToOne($row_list, $colNum)
{
  $list = [];
  foreach ($row_list as $row) {
    $list[] = $row[$colNum];
  }
  return $list;
}

/**
 * ファイルに追加せずに追加したい値が何番目(key)か返す
 *
 * @param  array $list    1次元配列のみの配列
 * @param  int   $add_num 追加したい値
 * @return int            何番目
 */
function whatNum($list, $add_num)
{
  usort($list, function ($point_1, $point_2) {
    return $point_1 <=> $point_2;
  });
  $list[] = $add_num;

  return array_keys($list, $add_num)[count(array_keys($list, $add_num)) - 1];
}


/* txt------------------------------------------------- */


/**
 * txtファイルを読み込み配列に格納する
 *
 * @param  string $file_path
 * @return array
 */
function readTxtFile($file_path)
{
  $fp = fopen($file_path, 'r');
  $row_list = [];
  while ($row = fgets($fp)) {
    $row = str_replace("\r", '', $row);
    $row = str_replace("\n", '', $row);
    $row_list[] = $row;
  }
  fclose($fp);
  return $row_list;
}


function addTxtData($file_path, $content)
{
  $fp = fopen($file_path, 'a');
  fputs($fp, $content . "\r\n");
  fclose($fp);
}


function writeTxtFile($file_path, $row_list)
{
  $fp = fopen($file_path, 'w');
  foreach ($row_list as $row) {
    fputs($fp, $row . "\r\n");
  }
  fclose($fp);
}


/**
 * 実行する度に+1するカウント
 *
 * @param  string $file_path ファイルパス
 * @param  int    $row_num   カウントしたい行番号
 * @return void
 */
function countNumTxt($file_path, $row_num)
{
  $row_list = readTxtFile($file_path);
  while (count($row_list) - 1 < $row_num) {
    $row_list[] = 0;
  }
  if (isset($row_list[$row_num])) {
    $data = $row_list[$row_num];
  } else {
    $data = 0;
  }
  $data++;
  $row_list[$row_num] = $data;
  writeTxtFile($file_path, $row_list);
}


//YYYYmmddHHiiss
function addNowTimeTxt($file_path)
{
  date_default_timezone_set('Asia/Tokyo');
  $dateTime = new DateTime();
  $YmdHis = $dateTime->format('YmdHis');
  addTxtData($file_path, $YmdHis);
}
