<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

$raw = file_get_contents('php://input');
if ($raw === false) { echo json_encode(['ok'=>false,'error'=>'no input']); exit; }

$data = json_decode($raw, true);
if (!is_array($data) || !isset($data['tabs']) || !is_array($data['tabs'])) {
  echo json_encode(['ok'=>false,'error'=>'invalid json']); exit;
}

$tabs = [];
foreach ($data['tabs'] as $t) {
  $title = isset($t['title']) ? trim((string)$t['title']) : '';
  $content = isset($t['content']) ? (string)$t['content'] : '';
  if ($title !== '' && $content !== '') { $tabs[] = ['title'=>$title, 'content'=>$content]; }
}

$payload = ['ok'=>true, 'version'=>time(), 'tabs'=>$tabs];
$file = __DIR__ . '/storage.json';
$tmp  = $file . '.tmp';

if (file_put_contents($tmp, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
  echo json_encode(['ok'=>false,'error'=>'write failed']); exit;
}
rename($tmp, $file);
echo json_encode(['ok'=>true,'saved'=>count($tabs)]);
