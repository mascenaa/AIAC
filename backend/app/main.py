from fastapi import FastAPI, HTTPException
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

@app.post("/move/")
def move_car(command: CommandCreate):
    db = SessionLocal()
    db_command = Command(direction=command.direction, speed=command.speed)
    db.add(db_command)
    db.commit()
    db.refresh(db_command)
    db.close()
    
    nodemcu_url = "http://192.168.100.33/move" 
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