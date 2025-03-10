import os

import psycopg
from psycopg.adapt import Loader
from psycopg.rows import dict_row


def initialize_db():
    """Initialize database schema
    This should be called only once at application startup.
    """
    conn_string = os.getenv("DATABASE_URL")
    if conn_string is None:
        raise Exception("couldn't read DATABASE_URL environment variable")
    with psycopg.connect(conn_string, autocommit=True) as connection:
        register_point_adapter(connection)
        with connection.cursor() as cursor:
            # Create tables
            cursor.execute(survivors_table_sql)
            cursor.execute(survivors_infection_accusations_table_sql)


def get_db():
    """Get a database connection.
    This is used as a FastAPI dependency for route handlers.
    """
    conn_string = os.getenv("DATABASE_URL")
    if conn_string is None:
        raise Exception("couldn't read DATABASE_URL environment variable")
    with psycopg.connect(
        conn_string, autocommit=True, row_factory=dict_row
    ) as connection:
        register_point_adapter(connection)
        with connection.cursor() as cursor:
            yield cursor


class PointLoader(Loader):
    def load(self, data: memoryview):
        # strip parentheses
        no_paren = data.tobytes()[1:-1]
        # read values as floats
        x, y = map(float, no_paren.split(b","))
        return (x, y)


def register_point_adapter(connection):
    connection.adapters.register_loader("point", PointLoader)


survivors_table_sql = """
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

survivors_infection_accusations_table_sql = """
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

example_survivors_sql = """
    INSERT INTO survivors (name, age, gender, last_location, water, food, medication, ammunition)
        VALUES ('Anna', 25, 'female', '(1,2)', 3, 3, 3, 3);
    INSERT INTO survivors (name, age, gender, last_location, water, food, medication, ammunition)
        VALUES ('Brian', 22, 'male', '(1,1)', 3, 3, 3, 3);
    INSERT INTO survivors (name, age, gender, last_location, water, food, medication, ammunition)
        VALUES ('Chris', 29, 'male', '(2,2)', 3, 3, 3, 3);
    INSERT INTO survivors (name, age, gender, last_location, water, food, medication, ammunition)
        VALUES ('Donna', 33, 'female', '(2,2)', 3, 3, 3, 3);
"""
