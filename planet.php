<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="css/planet.css" type="text/css">
  <script src="js/planet.js" defer></script>
  <title>Minesweeper Planet</title>
</head>

<body>

  <?php for ($i = 0; $i < 200; $i++) { ?>
    <div class="star"></div>
  <?php } ?>

  <div class="container">
    <?php for ($i = 0; $i < 35; $i++) { ?>
      <div class="circle"></div>
    <?php } ?>
  </div>

</body>

</html>