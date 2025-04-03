#include <WiFiS3.h>           // Include WiFi library (WiFiS3 for R4)
#include <ArduinoJson.h>     // Include ArduinoJson library for JSON handling
#include <OneWire.h>
#include <DallasTemperature.h>

const char* ssid = "Linksys14214";  // Replace with your WiFi network SSID
const char* password = "";  // Replace with your WiFi password
const char* host = "klimaserver-production.up.railway.app"; // Replace with your API server host
const int httpPort = 443;         // Port of the API server // https port 443

// Pin where the DS18B20 data line is connected
#define ONE_WIRE_BUS 2  // Digital Pin 2 for DS18B20

// Set up the OneWire instance
OneWire oneWire(ONE_WIRE_BUS);

// Pass the OneWire reference to DallasTemperature library
DallasTemperature sensors(&oneWire);

WiFiSSLClient client;

void setup() {
  Serial.begin(9600);
  delay(1000);

  // Start WiFi
  WiFi.begin(ssid);
  delay(2000);

  // Start up the DallasTemperature library
  sensors.begin();

  // Wait for WiFi to connect
  int retryCount = 0;
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    retryCount++;
    if (retryCount >= 10) {
      Serial.print("\nFailed to connect to WiFi! Status code: ");
      Serial.println(WiFi.status());  // Print the exact error code
      break;
    }
    delay(1000);
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected to WiFi");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  }
}



void loop() {
  sensors.requestTemperatures();

  // Get the temperature in Celsius
  float temperatureC = sensors.getTempCByIndex(0);
  
  // Get the temperature in Fahrenheit
  float temperatureF = sensors.getTempFByIndex(0);

  // Print out the temperature and humidity
  Serial.print("Temperature: ");
  Serial.print(temperatureC);
  Serial.print("°C ");
  Serial.print(temperatureF);
  Serial.println("°F");

  // Send data over HTTP
  if (client.connect(host, httpPort)) { // Connect to the API server
    // Prepare the JSON object with temperature
    StaticJsonDocument<200> doc;
    doc["Temperature"] = temperatureC;
    doc["Unit"] = "Celcius";

    // Convert the JSON object to a string
    String jsonData;
    serializeJson(doc, jsonData);

    // Prepare the HTTP POST request
    client.println("POST /recieveTemperature HTTP/1.1");  // Ensure to use the correct API endpoint path
    client.println("Host: klimaserver-production.up.railway.app"); // Correct host header
    client.println("Content-Type: application/json");  // Content type for JSON data
    client.print("Content-Length: ");
    client.println(jsonData.length());  // Correct content length
    client.println();  // Blank line separating headers from body
    client.println(jsonData);  // Send the JSON data as the body of the request

    // Wait for the response
    unsigned long timeout = millis();
    while (client.available() == 0) {
      if (millis() - timeout > 10000) {
        Serial.println("Timeout!");
        client.stop();
        return;
      }
    }

    // Read and print the response
    while (client.available()) {
      String line = client.readStringUntil('\r');
      Serial.print(line);
    }
    client.stop();
  } else {
    Serial.println("Connection failed!");
  }

  // Wait before sending the next request
  delay(10000);  // Wait 10 seconds
}
