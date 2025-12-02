<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

$file = __DIR__ . '/storage.json';
if (!is_file($file)) {
  $fallback = ['ok'=>true, 'version'=>time(), 'tabs'=>[['title'=>'Вкладка 1','content'=>'<p>Початковий контент.</p>']]];
  echo json_encode($fallback, JSON_UNESCAPED_UNICODE); exit;
}
$json = file_get_contents($file);
if ($json === false) { echo json_encode(['ok'=>false,'error'=>'read error']); exit; }
echo $json;
