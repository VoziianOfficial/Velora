<?php
declare(strict_types=1);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
function respond(int $code, bool $success, string $message): void { http_response_code($code); echo json_encode(['success'=>$success,'message'=>$message]); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Allow: POST'); respond(405,false,'Please submit the enquiry form.'); }
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) respond(413,false,'Your message is too long.');
function field(string $key): string { return isset($_POST[$key]) && is_string($_POST[$key]) ? trim($_POST[$key]) : ''; }
if (field('website_check') !== '') respond(422,false,'Unable to accept this enquiry.');
$name=field('name'); $email=field('email'); $service=field('service'); $location=field('location'); $message=field('message');
if (strlen($name)<2 || strlen($name)>120 || preg_match('/[\r\n]/',$name)) respond(422,false,'Please enter a valid name.');
if (!filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($email)>254 || preg_match('/[\r\n]/',$email)) respond(422,false,'Please enter a valid email address.');
if (!in_array($service,['Carpet cleaning','Rug cleaning','Carpet & rug cleaning'],true)) respond(422,false,'Please choose a service.');
if ($location==='' || strlen($location)>120) respond(422,false,'Please enter your town or postcode.');
if (strlen($message)<10 || strlen($message)>5000) respond(422,false,'Please enter a message between 10 and 5000 characters.');
if (field('privacy_consent')!=='1') respond(422,false,'Please accept the Privacy Policy.');

$raw=@file_get_contents(__DIR__.'/config/config.js');
if (!$raw || !preg_match('/^\s*window\.SiteConfig\s*=\s*(\{.*\})\s*;?\s*$/s',$raw,$matches)) respond(503,false,'The enquiry service is temporarily unavailable.');
$config=json_decode($matches[1],true);
$recipient=$config['email']??'';
if (!is_string($recipient) || !filter_var($recipient,FILTER_VALIDATE_EMAIL)) respond(503,false,'The enquiry service is temporarily unavailable.');
if (preg_match('/\.(example|test|invalid)$/i',substr(strrchr($recipient,'@'),1))) respond(503,false,'The enquiry service is being set up. Please try again later.');

$rateFile=sys_get_temp_dir().'/carpet-form-'.hash('sha256',__DIR__.($_SERVER['REMOTE_ADDR']??'unknown')).'.lock';
$handle=@fopen($rateFile,'c+');
if (!$handle || !flock($handle,LOCK_EX)) respond(503,false,'Please try again shortly.');
$last=(int)stream_get_contents($handle);
if (time()-$last<30) { fclose($handle); respond(429,false,'Please wait a moment before sending another request.'); }
$brand=preg_replace('/[\r\n]/',' ',(string)($config['companyName']??'Carpet care'));
$body="New enquiry for $brand\n\nName: $name\nEmail: $email\nService: $service\nLocation: $location\n\n$message\n\nPrivacy consent: accepted\n";
$subject='=?UTF-8?B?'.base64_encode($brand.' — '.$service.' enquiry').'?=';
$headers=['From'=>'Website enquiries <'.$recipient.'>','Reply-To'=>$email,'MIME-Version'=>'1.0','Content-Type'=>'text/plain; charset=UTF-8'];
$sent=function_exists('mail') && @mail($recipient,$subject,$body,$headers);
if ($sent) { rewind($handle); ftruncate($handle,0); fwrite($handle,(string)time()); }
flock($handle,LOCK_UN);fclose($handle);
if (!$sent) respond(503,false,'Your enquiry could not be sent. Please try again later.');
respond(200,true,(string)($config['contactSuccessMessage']??'Successfully sent!'));
