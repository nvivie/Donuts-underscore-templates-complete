<?php
$return = array(
	'error' => 'No action specified'
);

$donuts = array(
	array(
		'id' => 'shamrock',
		'name' => 'Shamrock',
		'image' => 'donut-shamrock.png'
	),
	array(
		'id' => 'grape',
		'name' => 'Grape',
		'image' => 'donut-grape-sprinkles.png'
	),
	array(
		'id' => 'tangerine',
		'name' => 'Tangerine',
		'image' => 'donut-tangerine-sprinkles.png'
	)
);

$action = (array_key_exists('action', $_REQUEST)) ? $_REQUEST['action'] : '';

switch ($action) :
	case 'more_donuts':
		$return['donuts'] = $donuts;
		$return['error'] = '';

		break;
endswitch;

echo json_encode($return);

exit();
?>
