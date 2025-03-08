import os

import pytest
from fastapi.testclient import TestClient
import psycopg
from psycopg.rows import dict_row

from ..main import app


@pytest.fixture
def test_client():
    return TestClient(app)


@pytest.fixture
def db_connection():
    conn_string = os.getenv(
        "TEST_DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/neurons_testing",
    )
    with psycopg.connect(
        conn_string, autocommit=True, row_factory=dict_row
    ) as connection:

        yield connection
