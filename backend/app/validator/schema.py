schema = {
    "date": {
        "type": "string",
        "required": True,
        "valid_date": 30 # en dias
    },
    "items": {
        "type": "list",
        "required": True,
        "schema": {
            "type": "dict",
            "allow_unknown": True,
            "schema": {
                "id": {"type": "integer", "required": True},
                "weight": {"type": "integer", "required": True, "min": 0},
            },
        },
    }
}