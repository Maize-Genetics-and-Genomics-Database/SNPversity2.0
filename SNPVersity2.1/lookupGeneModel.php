<?php

$geneId = $_GET['geneModelId'];

$genesData = unserialize(file_get_contents('./gff/genes_data.serialized'));

if (isset($genesData[$geneId])) {

    $geneInfo = $genesData[$geneId];
    // Convert the array to a JSON string
    $jsonString = json_encode($geneInfo);

    //echo $jsonString; // Output the JSON string
    echo $jsonString ;
    // Process $geneInfo as needed
} else {
    $data =[
        'chromosome' => 'chr1',
        'start' => '0',
        'end' => '0',
        'id' => 'empty'
    ];

    echo json_encode($data);
}
