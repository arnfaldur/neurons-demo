import uuid


def test_db_connection(test_cursor):
    """Test that the database connection works."""
    test_cursor.execute("SELECT 1 AS result")
    result = test_cursor.fetchone()
    assert result["result"] == 1


def test_create_and_read_item(test_cursor):
    """Test creating and reading a basic item in the database."""
    # Setup - create test table if it doesn't exist
    test_cursor.execute(
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
    test_cursor.execute(
        "INSERT INTO test_items (name, description) VALUES (%s, %s) RETURNING id",
        (test_name, test_description),
    )
    inserted_id = test_cursor.fetchone()["id"]

    # Retrieve and verify test data
    test_cursor.execute("SELECT * FROM test_items WHERE id = %s", (inserted_id,))
    result = test_cursor.fetchone()

    assert result is not None
    assert result["name"] == test_name
    assert result["description"] == test_description

    # Cleanup
    test_cursor.execute("DROP TABLE test_items")
