import json

from fastapi import status
from starlette.testclient import TestClient


def test_root(test_client: TestClient):
    response = test_client.get("/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "Welcome to the end of the world"}


def test_survivor_creation(test_client: TestClient):
    survivor = {
        "name": "John Doe",
        "age": 30,
        "gender": "male",
        "last_location": [3, 4],
    }
    post_response = test_client.post(
        "/survivor",
        content=json.dumps(survivor),
    )
    # generated by the primary key
    survivor_id = post_response.json()["id"]

    # ensure all sent values match values returned from API
    get_response = test_client.get(f"/survivor/{survivor_id}")
    for key in survivor:
        assert get_response.json()[key] == survivor[key]


def test_survivor_failed_creation(test_client: TestClient):
    bad_survivors = [
        {"name": 123, "age": 30, "gender": "male", "last_location": [3, 4]},
        {"name": "John", "age": 23, "gender": "male", "last_location": [3, 4, 5]},
        {"name": "John", "age": 23, "gender": "male", "last_location": "(3,4)"},
    ]
    for bad_survivor in bad_survivors:
        post_response = test_client.post(
            "/survivor",
            content=json.dumps(bad_survivor),
        )
        assert post_response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

