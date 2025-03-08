import os

import psycopg
from psycopg.adapt import Loader
from psycopg.rows import dict_row


def get_db():
    conn_string = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/neurons",
    )
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
