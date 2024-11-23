
printf("Access-Control-Allow-Origin: *\n");
printf("Access-Control-Allow-Methods: POST\n");
printf("Content-Type: application/octet-stream\n\n");
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="converted.ipk"
printf("Content-Type: application/json\n");
printf("Access-Control-Allow-Origin: *\n"); // Allow all origins, or replace "*" with a specific domain
printf("\n"); // Make sure there's an empty line between headers and the body
curl -X POST -F "apkFile=@example.apk" http://localhost:8000/cgi-bin/convert.cgi

