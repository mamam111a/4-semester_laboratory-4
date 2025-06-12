from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from auth import get_db, verify_user, create_access_token, get_current_user
from database import engine
from models import Base, Employee, Visitor, Event, Incident, ThreatLevel, Action, AssociationEmployees, AssociationVisitors, Role
from schemas import *
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

@app.post("/register", response_model=EmployeeOut, status_code=201)
def register(employee: EmployeeCreate, db: Session = Depends(get_db)):
    employee_data = employee.dict()
    employee_data["password"] = hash_password(employee.password)
    new_employee = Employee(**employee_data)
    db.add(new_employee)
    try:
        db.commit()
        db.refresh(new_employee)
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Пользователь с таким логином уже существует")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return new_employee

@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = verify_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    access_token = create_access_token(data={"sub": user.login})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
def read_users_me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}

def get_object_or_404(model, obj_id, db: Session, key="id"):
    obj = db.query(model).get(obj_id)
    if not obj:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
    return obj

@app.post("/employees", response_model=EmployeeOut, status_code=201)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

@app.get("/employees", response_model=list[EmployeeOut])
def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()

@app.get("/employees/{employee_id}", response_model=EmployeeOut)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    return get_object_or_404(Employee, employee_id, db, "employee_id")

@app.put("/employees/{employee_id}", response_model=EmployeeOut)
def update_employee(employee_id: int, employee: EmployeeCreate, db: Session = Depends(get_db)):
    db_emp = get_object_or_404(Employee, employee_id, db, "employee_id")
    for field, value in employee.dict().items():
        setattr(db_emp, field, value)
    db.commit()
    db.refresh(db_emp)
    return db_emp

@app.delete("/employees/{employee_id}", status_code=204)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    db.query(AssociationEmployees).filter_by(employee_id=employee_id).delete()
    emp = get_object_or_404(Employee, employee_id, db, "employee_id")
    db.delete(emp)
    db.commit()

@app.post("/visitors", response_model=VisitorOut, status_code=201)
def create_visitor(visitor: VisitorCreate, db: Session = Depends(get_db)):
    db_obj = Visitor(**visitor.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@app.get("/visitors", response_model=list[VisitorOut])
def get_visitors(db: Session = Depends(get_db)):
    return db.query(Visitor).all()

@app.get("/visitors/{visitor_id}", response_model=VisitorOut)
def get_visitor(visitor_id: int, db: Session = Depends(get_db)):
    return get_object_or_404(Visitor, visitor_id, db, "visitor_id")

@app.put("/visitors/{visitor_id}", response_model=VisitorOut)
def update_visitor(visitor_id: int, item: VisitorCreate, db: Session = Depends(get_db)):
    obj = get_object_or_404(Visitor, visitor_id, db, "visitor_id")
    for field, value in item.dict().items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj

@app.delete("/visitors/{visitor_id}", status_code=204)
def delete_visitor(visitor_id: int, db: Session = Depends(get_db)):
    db.query(AssociationVisitors).filter_by(visitor_id=visitor_id).delete()
    obj = get_object_or_404(Visitor, visitor_id, db, "visitor_id")
    db.delete(obj)
    db.commit()

@app.post("/events", response_model=EventOut, status_code=201)
def create_event(item: EventCreate, db: Session = Depends(get_db)):
    db_obj = Event(**item.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@app.get("/events", response_model=list[EventOut])
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).all()

@app.get("/events/{event_id}", response_model=EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    return get_object_or_404(Event, event_id, db, "event_id")

@app.put("/events/{event_id}", response_model=EventOut)
def update_event(event_id: int, item: EventCreate, db: Session = Depends(get_db)):
    obj = get_object_or_404(Event, event_id, db, "event_id")
    for field, value in item.dict().items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj

@app.delete("/events/{event_id}", status_code=204)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    db.query(Incident).filter_by(event_id=event_id).delete()
    obj = get_object_or_404(Event, event_id, db, "event_id")
    db.delete(obj)
    db.commit()

@app.post("/threatlevels", response_model=ThreatLevelOut, status_code=201)
def create_threatlevel(item: ThreatLevelCreate, db: Session = Depends(get_db)):
    db_obj = ThreatLevel(**item.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@app.get("/threatlevels", response_model=list[ThreatLevelOut])
def get_threatlevels(db: Session = Depends(get_db)):
    return db.query(ThreatLevel).all()

@app.get("/threatlevels/{threatlevel_id}", response_model=ThreatLevelOut)
def get_threatlevel(threatlevel_id: int, db: Session = Depends(get_db)):
    return get_object_or_404(ThreatLevel, threatlevel_id, db, "threatlevel_id")

@app.put("/threatlevels/{threatlevel_id}", response_model=ThreatLevelOut)
def update_threatlevel(threatlevel_id: int, item: ThreatLevelCreate, db: Session = Depends(get_db)):
    obj = get_object_or_404(ThreatLevel, threatlevel_id, db, "threatlevel_id")
    for field, value in item.dict().items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj

@app.delete("/threatlevels/{threatlevel_id}", status_code=204)
def delete_threatlevel(threatlevel_id: int, db: Session = Depends(get_db)):
    db.query(Incident).filter_by(threatlevel_id=threatlevel_id).delete()
    db.query(Action).filter_by(threatlevel_id=threatlevel_id).delete()
    obj = get_object_or_404(ThreatLevel, threatlevel_id, db, "threatlevel_id")
    db.delete(obj)
    db.commit()

@app.post("/incidents", response_model=IncidentOut, status_code=201)
def create_incident(item: IncidentCreate, db: Session = Depends(get_db)):
    db_obj = Incident(**item.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@app.get("/incidents", response_model=list[IncidentOut])
def get_incidents(db: Session = Depends(get_db)):
    return db.query(Incident).all()

@app.get("/incidents/{incident_id}", response_model=IncidentOut)
def get_incident(incident_id: int, db: Session = Depends(get_db)):
    return get_object_or_404(Incident, incident_id, db, "incident_id")

@app.put("/incidents/{incident_id}", response_model=IncidentOut)
def update_incident(incident_id: int, item: IncidentCreate, db: Session = Depends(get_db)):
    obj = get_object_or_404(Incident, incident_id, db, "incident_id")
    for field, value in item.dict().items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj

@app.delete("/incidents/{incident_id}", status_code=204)
def delete_incident(incident_id: int, db: Session = Depends(get_db)):
    obj = get_object_or_404(Incident, incident_id, db, "incident_id")
    db.delete(obj)
    db.commit()

@app.post("/actions", response_model=ActionOut, status_code=201)
def create_action(item: ActionCreate, db: Session = Depends(get_db)):
    db_obj = Action(**item.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@app.get("/actions", response_model=list[ActionOut])
def get_actions(db: Session = Depends(get_db)):
    return db.query(Action).all()

@app.get("/actions/{action_id}", response_model=ActionOut)
def get_action(action_id: int, db: Session = Depends(get_db)):
    return get_object_or_404(Action, action_id, db, "action_id")

@app.put("/actions/{action_id}", response_model=ActionOut)
def update_action(action_id: int, item: ActionCreate, db: Session = Depends(get_db)):
    obj = get_object_or_404(Action, action_id, db, "action_id")
    for field, value in item.dict().items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj

@app.delete("/actions/{action_id}", status_code=204)
def delete_action(action_id: int, db: Session = Depends(get_db)):
    obj = get_object_or_404(Action, action_id, db, "action_id")
    db.delete(obj)
    db.commit()

@app.post("/association/employees", status_code=201)
def add_association_employee(item: AssociationEmployee, db: Session = Depends(get_db)):
    db_obj = AssociationEmployees(**item.dict())
    db.add(db_obj)
    db.commit()
    return {"detail": "Created"}

@app.delete("/association/employees", status_code=204)
def delete_association_employee(item: AssociationEmployee, db: Session = Depends(get_db)):
    db_obj = db.query(AssociationEmployees).filter_by(**item.dict()).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Association not found")
    db.delete(db_obj)
    db.commit()

@app.post("/association/visitors", status_code=201)
def add_association_visitor(item: AssociationVisitor, db: Session = Depends(get_db)):
    db_obj = AssociationVisitors(**item.dict())
    db.add(db_obj)
    db.commit()
    return {"detail": "Created"}

@app.delete("/association/visitors", status_code=204)
def delete_association_visitor(item: AssociationVisitor, db: Session = Depends(get_db)):
    db_obj = db.query(AssociationVisitors).filter_by(**item.dict()).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Association not found")
    db.delete(db_obj)
    db.commit()

@app.post("/roles", response_model=RoleOut, status_code=201)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    db_obj = Role(**role.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@app.get("/roles", response_model=list[RoleOut])
def get_roles(db: Session = Depends(get_db)):
    return db.query(Role).all()

@app.get("/roles/{role_id}", response_model=RoleOut)
def get_role(role_id: int, db: Session = Depends(get_db)):
    return get_object_or_404(Role, role_id, db, "role_id")

@app.put("/roles/{role_id}", response_model=RoleOut)
def update_role(role_id: int, item: RoleCreate, db: Session = Depends(get_db)):
    obj = get_object_or_404(Role, role_id, db, "role_id")
    for field, value in item.dict().items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj

@app.delete("/roles/{role_id}", status_code=204)
def delete_role(role_id: int, db: Session = Depends(get_db)):
    obj = get_object_or_404(Role, role_id, db, "role_id")
    db.delete(obj)
    db.commit()