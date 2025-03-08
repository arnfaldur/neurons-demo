from fastapi import status
from starlette.testclient import TestClient


def test_root(test_client: TestClient):
    response = test_client.get("/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "Welcome to the end of the world"}
