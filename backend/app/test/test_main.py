from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.main import app, Base, Command, SensorData, SQLALCHEMY_DATABASE_URL

client = TestClient(app)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[SessionLocal] = override_get_db

def test_start_stream():
    response = client.get("/start-stream/")
    assert response.status_code == 200
    assert response.json() == {"status": "success", "message": "Transmissão iniciada"}

def test_stop_stream():
    response = client.get("/stop-stream/")
    assert response.status_code == 200
    assert response.json() == {"status": "success", "message": "Transmissão interrompida"}

def test_move_car():
    response = client.post("/move/", json={"direction": "forward", "speed": 10})
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["command"]["direction"] == "forward"
    assert response.json()["command"]["speed"] == 10

def test_receive_sensor_data():
    response = client.post("/sensor/", json={
        "battery_temperature": 36.5,
        "current_position": "12.34,56.78",
        "battery_status": "Good",
        "lights_on": True
    })
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["sensor_data"]["battery_temperature"] == 36.5
    assert response.json()["sensor_data"]["current_position"] == "12.34,56.78"
    assert response.json()["sensor_data"]["battery_status"] == "Good"
    assert response.json()["sensor_data"]["lights_on"] == True

def test_get_commands():
    response = client.get("/commands/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)