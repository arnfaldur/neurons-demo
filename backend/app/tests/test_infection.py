from fastapi import status
from starlette.testclient import TestClient


def test_survivor_infection(test_client: TestClient):
    # This would ideally be found by searching,
    # but we rely on the mock data and serial primary keys instead
    get_response = test_client.get("/survivors")
    survivor_ids = list(map(lambda s: s["id"], get_response.json()))

    get_response = test_client.get(f"/survivors/{survivor_ids[1]}/infection")
    # zero accusations mean not infected
    assert not get_response.json()["infected"]

    # this survivor already has one accusation
    get_response = test_client.get(f"/survivors/{survivor_ids[0]}/infection")
    # one accusations mean not infected
    assert not get_response.json()["infected"]

    post_response = test_client.post(
        f"/survivors/{survivor_ids[0]}/infection", json={"accuser_id": survivor_ids[1]}
    )
    assert post_response.status_code == status.HTTP_200_OK
    get_response = test_client.get(f"/survivors/{survivor_ids[0]}/infection")
    # two accusations means not infected
    assert not get_response.json()["infected"]

    # this infection accusation already exists
    post_response = test_client.post(
        f"/survivors/{survivor_ids[0]}/infection", json={"accuser_id": survivor_ids[2]}
    )
    # so we get a 409 conflict
    assert post_response.status_code == status.HTTP_409_CONFLICT
    get_response = test_client.get(f"/survivors/{survivor_ids[0]}/infection")
    # there are still two accusations which means not infected
    assert not get_response.json()["infected"]

    post_response = test_client.post(
        f"/survivors/{survivor_ids[0]}/infection", json={"accuser_id": survivor_ids[3]}
    )
    assert post_response.status_code == status.HTTP_200_OK
    get_response = test_client.get(f"/survivors/{survivor_ids[0]}/infection")
    # three accusations and the survivor is infected
    assert get_response.json()["infected"]
