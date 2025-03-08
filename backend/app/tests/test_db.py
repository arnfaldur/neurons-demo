import uuid

import pytest
import psycopg


def test_db_connection(db_connection):
    """Test that the database connection works."""
    with db_connection.cursor() as cur:
        cur.execute("SELECT 1 AS result")
        result = cur.fetchone()
        assert result["result"] == 1


def test_create_and_read_item(db_connection):
    """Test creating and reading a basic item in the database."""
    # Setup - create test table if it doesn't exist
    with db_connection.cursor() as cur:
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS test_items (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """
        )

    # Generate unique test data
    test_name = f"Test Item {uuid.uuid4()}"
    test_description = f"Test Description {uuid.uuid4()}"

    # Insert test data
    with db_connection.cursor() as cur:
        cur.execute(
            "INSERT INTO test_items (name, description) VALUES (%s, %s) RETURNING id",
            (test_name, test_description),
        )
        inserted_id = cur.fetchone()["id"]

    # Retrieve and verify test data
    with db_connection.cursor() as cur:
        cur.execute("SELECT * FROM test_items WHERE id = %s", (inserted_id,))
        result = cur.fetchone()

        assert result is not None
        assert result["name"] == test_name
        assert result["description"] == test_description

    # Cleanup
    with db_connection.cursor() as cur:
        cur.execute("DROP TABLE test_items")
