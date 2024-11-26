#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_FILE_SIZE 10485760 // 10 MB max file size
#define TMP_FILE "/tmp/uploaded.apk"
#define OUTPUT_FILE "/tmp/converted.ipk"

// Function to extract content from POST request
void save_uploaded_file() {
    char buffer[1024];
    size_t bytes_read;

    FILE *uploaded_file = fopen(TMP_FILE, "wb");
    if (!uploaded_file) {
        printf("Status: 500 Internal Server Error\r\n");
        printf("Content-Type: text/plain\r\n\r\n");
        printf("Error: Unable to open temporary file for writing.\n");
        exit(1);
    }

    while ((bytes_read = fread(buffer, 1, sizeof(buffer), stdin)) > 0) {
        fwrite(buffer, 1, bytes_read, uploaded_file);
    }

    fclose(uploaded_file);
}

// Dummy conversion logic
void convert_to_ipk(const char *input, const char *output) {
    FILE *in = fopen(input, "rb");
    FILE *out = fopen(output, "wb");

    if (!in || !out) {
        perror("File error");
        printf("Status: 500 Internal Server Error\r\n");
        printf("Content-Type: text/plain\r\n\r\n");
        printf("Error: File conversion failed.\n");
        exit(1);
    }

    // Simulate conversion (just copy the file)
    char buffer[1024];
    size_t bytes_read;
    while ((bytes_read = fread(buffer, 1, sizeof(buffer), in)) > 0) {
        fwrite(buffer, 1, bytes_read, out);
    }

    fclose(in);
    fclose(out);
}

int main() {
    // Check request method
    char *request_method = getenv("REQUEST_METHOD");
    if (!request_method || strcmp(request_method, "POST") != 0) {
        printf("Status: 405 Method Not Allowed\r\n");
        printf("Content-Type: text/plain\r\n\r\n");
        printf("Error: Only POST method is allowed.\n");
        return 1;
    }

    // Save uploaded file
    save_uploaded_file();

    // Convert the file
    convert_to_ipk(TMP_FILE, OUTPUT_FILE);

    // Send the converted file as a response
    FILE *converted_file = fopen(OUTPUT_FILE, "rb");
    if (!converted_file) {
        printf("Status: 500 Internal Server Error\r\n");
        printf("Content-Type: text/plain\r\n\r\n");
        printf("Error: Unable to read converted file.\n");
        return 1;
    }

    printf("Status: 200 OK\r\n");
    printf("Content-Type: application/octet-stream\r\n");
    printf("Content-Disposition: attachment; filename=\"converted.ipk\"\r\n\r\n");

    char buffer[1024];
    size_t bytes_read;
    while ((bytes_read = fread(buffer, 1, sizeof(buffer), converted_file)) > 0) {
        fwrite(buffer, 1, bytes_read, stdout);
    }

    fclose(converted_file);
    return 0;
}
