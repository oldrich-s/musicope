<?php
if (!isset($_GET['url'])) die();
$url = urldecode($_GET['url']);
echo base64_encode(file_get_contents($url));
?>