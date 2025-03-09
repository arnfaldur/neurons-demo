import os

import pytest
from fastapi.testclient import TestClient
import psycopg
from psycopg.rows import dict_row

from ..main import app
from ..database import get_db, register_point_adapter


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
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS survivors (
                    id SERIAL primary key,
                    name text NOT NULL,
                    gender text,
                    age integer,
                    last_location point,
                    water integer DEFAULT 0,
                    food integer DEFAULT 0,
                    medication integer DEFAULT 0,
                    ammunition integer DEFAULT 0
                )
                """
            )
            # infection accusation table
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS survivors_infection_accusations (
                accuser_id integer NOT NULL,
                accused_id integer NOT NULL,

                PRIMARY KEY (accuser_id, accused_id),

                CONSTRAINT fk_accused FOREIGN KEY (accused_id) REFERENCES
                    survivors (id) ON DELETE CASCADE,
                CONSTRAINT fk_accuser FOREIGN KEY (accuser_id) REFERENCES
                    survivors (id) ON DELETE CASCADE,

                CONSTRAINT no_self_accuse CHECK (accused_id != accuser_id)
                )
                """
            )
            cursor.execute(
                """
                INSERT INTO survivors (name, age, gender, last_location, water, food, medication, ammunition)
                    VALUES ('Anna', 25, 'female', '(1,2)', 3, 3, 3, 3);
                INSERT INTO survivors (name, age, gender, last_location, water, food, medication, ammunition)
                    VALUES ('Brian', 22, 'male', '(1,1)', 3, 3, 3, 3);
                INSERT INTO survivors (name, age, gender, last_location, water, food, medication, ammunition)
                    VALUES ('Chris', 29, 'male', '(2,2)', 3, 3, 3, 3);
                INSERT INTO survivors (name, age, gender, last_location, water, food, medication, ammunition)
                    VALUES ('Donna', 33, 'female', '(2,2)', 3, 3, 3, 3);
                """,
            )
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
