<?php
// Emails website form submissions (consultation, onboarding, website update)
// to the wrwebsites inbox. Called by client/src/lib/sendForm.ts.

date_default_timezone_set('Europe/London');
header('Content-Type: application/json; charset=utf-8');

$TO_EMAIL   = 'zachhreillyy@gmail.com';
$FROM_EMAIL = 'noreply@wrwebsites.com';
$ALLOWED_FORMS = [
    'Consultation request',
    'New client onboarding',
    'Website update request',
];

function reply($code, $success, $message) {
    http_response_code($code);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

function clean_line($value) {
    // Header-safe: no new lines, trimmed, limited length
    return mb_substr(trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', (string)$value)), 0, 200);
}

function label($key) {
    // "businessName" -> "Business name"
    $words = strtolower(preg_replace('/(?<!^)[A-Z]/', ' $0', $key));
    return ucfirst(str_replace('_', ' ', $words));
}

function to_text($value) {
    if (is_bool($value)) return $value ? 'Yes' : 'No';
    if ($value === null || $value === '') return '-';
    if (is_array($value)) return implode(', ', array_map('to_text', $value));
    return mb_substr((string)$value, 0, 5000);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    reply(405, false, 'Method not allowed.');
}

$raw = file_get_contents('php://input');
if (strlen($raw) > 100000) {
    reply(413, false, 'That message is too long.');
}

$input = json_decode($raw, true);
if (!is_array($input) || !isset($input['form'], $input['data']) || !is_array($input['data'])) {
    reply(400, false, 'Invalid request.');
}

$form = $input['form'];
$data = $input['data'];

if (!in_array($form, $ALLOWED_FORMS, true)) {
    reply(400, false, 'Unknown form.');
}

// Every form has a name and an email
$name  = clean_line($data['fullName'] ?? $data['name'] ?? '');
$email = clean_line($data['email'] ?? '');

if ($name === '') {
    reply(422, false, 'Please enter your name.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reply(422, false, 'Please enter a valid email address.');
}

$lines = [];
foreach ($data as $key => $value) {
    if (!is_string($key)) continue;
    $lines[] = label($key) . ': ' . to_text($value);
}

$body  = "New \"{$form}\" from the wrwebsites website\n";
$body .= str_repeat('-', 40) . "\n\n";
$body .= implode("\n", $lines) . "\n\n";
$body .= str_repeat('-', 40) . "\n";
$body .= 'Sent: ' . date('j M Y, H:i') . "\n";
$body .= "Reply to this email to answer {$name} directly.\n";

$subject = clean_line("{$form} - {$name}");

$headers  = "From: wrwebsites <{$FROM_EMAIL}>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($TO_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, "-f{$FROM_EMAIL}");

if (!$sent) {
    reply(500, false, 'Sorry, your message could not be sent. Please email us at ' . $TO_EMAIL . '.');
}

reply(200, true, "Thanks! We'll be in touch within 24 hours.");
