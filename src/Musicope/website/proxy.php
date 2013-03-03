<?php
if (!isset($_GET['url'])) die();
$url = str_replace(' ', '%20', $_GET['url']);
echo base64_encode(file_get_contents($url));
?>