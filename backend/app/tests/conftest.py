import os

import pytest
import psycopg
from psycopg.rows import dict_row


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
