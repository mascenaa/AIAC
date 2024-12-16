import socket
import subprocess
from time import sleep
from urllib.request import urlopen
from fastapi import FastAPI, HTTPException, BackgroundTasks
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
import os
import requests

app = FastAPI()

SQLALCHEMY_DATABASE_URL = "postgresql://user:password@db:5432/aiac_db"
print(f"Database URL: {SQLALCHEMY_DATABASE_URL}")

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Error connecting to the database: {e}")
    raise

class Command(Base):
    __tablename__ = "commands"

    id = Column(Integer, primary_key=True, index=True)
    direction = Column(String, index=True)
    speed = Column(Integer)

class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True, index=True)
    battery_temperature = Column(Float)
    current_position = Column(String)
    battery_status = Column(String)
    lights_on = Column(Boolean)


Base.metadata.create_all(bind=engine)

class CommandCreate(BaseModel):
    direction: str
    speed: int

class SensorDataCreate(BaseModel):
    battery_temperature: float
    current_position: str
    battery_status: str
    lights_on: bool

def get_command_msg(id):
    return "_GPHD_:%u:%u:%d:%1lf\n" % (0, 0, 2, 0)

GOPRO_IP = "10.5.5.9"
UDP_PORT = 8554
KEEP_ALIVE_PERIOD = 2500
KEEP_ALIVE_CMD = 2

def start_gopro_stream():
    MESSAGE = get_command_msg(KEEP_ALIVE_CMD)
    urlopen(f"http://{GOPRO_IP}:8080/live/amba.m3u8").read()

    loglevel_verbose = "-loglevel panic"
    subprocess.Popen(
        f"ffplay {loglevel_verbose} -fflags nobuffer -f:v mpegts -probesize 8192 udp://{GOPRO_IP}:{UDP_PORT}",
        shell=True,
    )

    while True:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.sendto(bytes(MESSAGE, "utf-8"), (GOPRO_IP, UDP_PORT))
        sleep(KEEP_ALIVE_PERIOD / 1000)

@app.get("/start-stream/")
def start_stream(background_tasks: BackgroundTasks):
    try:
        background_tasks.add_task(start_gopro_stream)
        return {"status": "success", "message": "Transmissão iniciada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao iniciar a transmissão: {e}")

@app.get("/stop-stream/")
def stop_stream():
    try:
        subprocess.run(["pkill", "-f", "ffplay"], check=True)
        return {"status": "success", "message": "Transmissão interrompida"}
    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail="Erro ao interromper a transmissão")


@app.post("/move/")
def move_car(command: CommandCreate):
    db = SessionLocal()
    db_command = Command(direction=command.direction, speed=command.speed)
    db.add(db_command)
    db.commit()
    db.refresh(db_command)
    db.close()
    
    nodemcu_url = "http://192.168.100.55/move" 
    try:
        response = requests.post(nodemcu_url, json={"direction": command.direction, "speed": command.speed})
        if response.status_code == 200:
            return {"status": "success", "command": command, "nodemcu_response": response.json()}
        else:
            raise HTTPException(status_code=500, detail="Falha ao enviar comando para o NodeMCU")
    except requests.RequestException:
        raise HTTPException(status_code=500, detail="Erro de conexão com o NodeMCU")

@app.post("/sensor/")
def receive_sensor_data(sensor_data: SensorDataCreate):
    db = SessionLocal()
    db_sensor_data = SensorData(
        battery_temperature=sensor_data.battery_temperature,
        current_position=sensor_data.current_position,
        battery_status=sensor_data.battery_status,
        lights_on=sensor_data.lights_on
    )
    db.add(db_sensor_data)
    db.commit()
    db.refresh(db_sensor_data)
    db.close()
    return {"status": "success", "sensor_data": sensor_data}

@app.get("/commands/")
def get_commands():
    db = SessionLocal()
    commands = db.query(Command).all()
    db.close()
    return commands