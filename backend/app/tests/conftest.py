import os

import pytest
from fastapi.testclient import TestClient
import psycopg
from psycopg.rows import dict_row

from ..main import app
from ..database import (
    get_db,
    register_point_adapter,
    survivors_table_sql,
    survivors_infection_accusations_table_sql,
    example_survivors_sql,
)


@pytest.fixture
def test_db():
    conn_string = os.getenv(
        "TEST_DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5434/neurons_testing",
    )
    with psycopg.connect(
        conn_string, autocommit=True, row_factory=dict_row
    ) as connection:
        register_point_adapter(connection)

        with connection.cursor() as cursor:
            # survivor table
            cursor.execute(survivors_table_sql)
            # infection accusation table
            cursor.execute(survivors_infection_accusations_table_sql)
            cursor.execute(example_survivors_sql)
            cursor.execute(
                """
                INSERT INTO survivors_infection_accusations (accuser_id, accused_id) VALUES (3,1);
                """,
            )

        yield connection

        with connection.cursor() as cursor:
            cursor.execute("DROP TABLE survivors_infection_accusations")
            cursor.execute("DROP TABLE survivors")


@pytest.fixture
def test_client(test_cursor):

    # Inject the test db into the api
    app.dependency_overrides[get_db] = lambda: test_cursor

    return TestClient(app)


@pytest.fixture
def test_cursor(test_db):
    with test_db.cursor() as cursor:
        yield cursor
