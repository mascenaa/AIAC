#include "ESP8266WiFi.h";
#include "ESP8266WebServer.h";
#include "ArduinoJson.h";
#include "Servo.h";
#include <GoProControl.h>;

#define CAMERA HERO4

const char *ssid = "JOAO__.2.4 G";
const char *password = "159683247";

const char *GOPRO_SSID = "bmwixespm";
const char *GOPRO_PASS = "goprohero4";

GoProControl gp(GOPRO_SSID, GOPRO_PASS, CAMERA);
ESP8266WebServer server(80);

const int SERVO_PIN = D1;

const int MOTOR_CC_PIN1 = D6;
const int MOTOR_CC_PIN2 = D7;

const int LED = D0;

Servo steeringServo;

int currentAngle = 90;

const int ANGLE_INCREMENT = 5;

void setup() {
  Serial.begin(115200);
  gp.enableDebug(&Serial);

  digitalWrite(LED, HIGH);
  pinMode(MOTOR_CC_PIN1, OUTPUT);
  pinMode(MOTOR_CC_PIN2, OUTPUT);
  steeringServo.attach(SERVO_PIN);

  // Centraliza o servo no início com movimentos rápidos
  for (int angle = currentAngle; angle != 90; ) {
    if (currentAngle > 90) {
      angle = max(90, angle - 10); // Movendo para o centro em passos maiores
    } else {
      angle = min(90, angle + 10); // Movendo para o centro em passos maiores
    }
    steeringServo.write(angle);
    delay(30); // Aumenta a velocidade
  }
  currentAngle = 90;

  pinMode(MOTOR_CC_PIN1, OUTPUT);
  pinMode(MOTOR_CC_PIN2, OUTPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }
  Serial.println("Conectado ao WiFi");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  server.on("/move", HTTP_POST, handleMove);

  server.begin();
  Serial.println("Servidor HTTP iniciado");
}

void loop()
{
  server.handleClient();

  char in = 0;
  if (Serial.available() > 0)
  {
    in = Serial.read();
  }

  switch (in)
  {
  default:
    break;

  // Connect
  case 'b':
    gp.begin();
    break;

  case 'c':
    Serial.print("Connected: ");
    Serial.println(gp.isConnected() == true ? "Yes" : "No");
    break;

  case 'p':
    gp.confirmPairing();
    break;

  case 's':

    if (CAMERA == HERO3)
    {
      char *statusChar;
      statusChar = gp.getStatus();
      Serial.println("Status :");
      for (int i = 0; i < 56; i++)
      {
        Serial.print(statusChar[i], HEX);
        Serial.print(" ");
      }
      Serial.println("");
      Serial.println("End Status.");
      if (statusChar[0] == 0x00)
      {
        Serial.println("camera ON");
      }
      else
      {
        Serial.println("camera OFF");
      }
      free(statusChar); // Don't forget to free memory
    }

    else
    {
      char *statusChar;
      statusChar = gp.getStatus();
      Serial.println("Status :");
      Serial.println(statusChar);
      free(statusChar); // Don't forget to free memory
    }

    break;

  case 'm': // DO NOT USE WHEN CAMERA IS OFF, IT FREEZE ESP
    char *medialist;
    medialist = gp.getMediaList();
    Serial.println("Media List:");
    Serial.println(medialist);
    free(medialist); // Don't forget to free memory
    break;

  // Turn on and off
  case 'T':
    gp.turnOn();
    break;

  case 't':
    gp.turnOff();
    break;

  // Take a picture of start a video
  case 'A':
    gp.shoot();
    break;

  // Stop the video
  case 'S':
    gp.stopShoot();
    break;

  // Check if it is recording
  case 'r':
    Serial.print("Recording: ");
    Serial.println(gp.isRecording() == true ? "Yes" : "No");
    break;

  // Set modes
  case 'V':
    gp.setMode(VIDEO_MODE);
    break;

  case 'P':
    gp.setMode(PHOTO_MODE);
    break;

  case 'M':
    gp.setMode(MULTISHOT_MODE);
    break;

  // Change the orientation
  case 'U':
    gp.setOrientation(ORIENTATION_UP);
    break;

  case 'D':
    gp.setOrientation(ORIENTATION_DOWN);
    break;

  // Change other parameters
  case 'f':
    gp.setVideoFov(MEDIUM_FOV);
    break;

  case 'F':
    gp.setFrameRate(FR_120);
    break;

  case 'R':
    gp.setVideoResolution(VR_1080p);
    break;

  case 'h':
    gp.setPhotoResolution(PR_12MP_WIDE);
    break;

  case 'L':
    gp.setTimeLapseInterval(60);
    break;

  // Localize the camera
  case 'O':
    gp.localizationOn();
    break;

  case 'o':
    gp.localizationOff();
    break;

  // Delete some files, be carefull!
  case 'l':
    gp.deleteLast();
    break;

  case 'g':
    gp.deleteAll();
    break;

  // Print useful data
  case 'd':
    gp.printStatus();
    break;

  // Close the connection
  case 'X':
    gp.end();
    break;
  }
  gp.keepAlive(); // not needed on HERO3
}

void handleMove()
{
  if (server.hasArg("plain"))
  {
    String body = server.arg("plain");
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, body);

    String direction = doc["direction"];
    int speed = doc["speed"];

    if (direction == "forward")
    {
      moveForward(speed);
    }
    else if (direction == "backward")
    {
      moveBackward(speed);
    }
    else if (direction == "left")
    {
      turnLeft();
    }
    else if (direction == "right")
    {
      turnRight();
    }
    else if (direction == "stop")
    {
      stopMotors();
    }
    else if (direction == "center")
    {
      centerSteering();
    }

    server.send(200, "application/json", "{\"status\":\"success\",\"currentAngle\":" + String(currentAngle) + "}");
  }
  else
  {
    server.send(400, "application/json", "{\"status\":\"error\",\"message\":\"No data received\"}");
  }
}

void moveForward(int speed) {
  analogWrite(MOTOR_CC_PIN1, constrain(speed, 0, 1023));
  digitalWrite(MOTOR_CC_PIN2, LOW);
}

void moveBackward(int speed)
{
  digitalWrite(MOTOR_CC_PIN1, LOW);
  analogWrite(MOTOR_CC_PIN2, speed);
}

void turnLeft() {
  if (currentAngle > 45) {
    currentAngle -= 10; // Incremento maior para mais velocidade
    steeringServo.write(currentAngle);
    Serial.println("Turning left, angle: " + String(currentAngle));
  }
}

void turnRight() {
  if (currentAngle < 135) {
    currentAngle += 10; // Incremento maior para mais velocidade
    steeringServo.write(currentAngle);
    Serial.println("Turning right, angle: " + String(currentAngle));
  }
}


void centerSteering()
{
  currentAngle = 90;
  steeringServo.write(currentAngle);
}

void stopMotors()
{
  digitalWrite(MOTOR_CC_PIN1, LOW);
  digitalWrite(MOTOR_CC_PIN2, LOW);
}