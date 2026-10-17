<?php
// Dev only: logs straight into the compose Postgres with the ADMINER_AUTOLOGIN_* env vars.
// Mounted into the official adminer image's plugins-enabled/ by docker-compose.yml.

if (!isset($_GET['pgsql']) && empty($_POST)) {
	$_POST['auth'] = [
		'driver' => 'pgsql',
		'server' => getenv('ADMINER_DEFAULT_SERVER'),
		'username' => getenv('ADMINER_AUTOLOGIN_USER'),
		'password' => getenv('ADMINER_AUTOLOGIN_PASSWORD'),
		'db' => getenv('ADMINER_AUTOLOGIN_DB'),
		'permanent' => 1,
	];
}

return new class extends Adminer\Plugin {};
