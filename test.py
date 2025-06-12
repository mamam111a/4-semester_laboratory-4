from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code in (200, 404)  # если у тебя нет "/" — тогда 404

def test_register_and_login():
    # Регистрируем нового пользователя
    register_response = client.post("/register", json={
        "login": "testuser",
        "password": "testpass",
        "full_name": "Тестовый Пользователь",
        "role_id": 1  # замените на существующую роль
    })
    assert register_response.status_code in (200, 400)  # может быть 400, если пользователь уже есть

    # Логинимся
    token_response = client.post("/token", data={
        "username": "testuser",
        "password": "testpass"
    })

    assert token_response.status_code == 200
    token_data = token_response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

def test_protected_route():
    # Получаем токен
    token_response = client.post("/token", data={
        "username": "testuser",
        "password": "testpass"
    })
    token = token_response.json()["access_token"]

    # Пытаемся попасть на защищённый эндпоинт
    protected_response = client.get("/users/me", headers={
        "Authorization": f"Bearer {token}"
    })
    assert protected_response.status_code == 200
    assert "login" in protected_response.json()
