from datetime import date, datetime
from decimal import Decimal
from typing import Dict, List, Any

def format_number(n):
    s = str(n)
    if '.' in s:
        integer_part, fractional_part = s.split('.', 1)
    else:
        integer_part = s
        fractional_part = ''
    try:
        formatted_integer = "{:,}".format(int(integer_part))
    except ValueError:
        return s
    if fractional_part:
        return f"{formatted_integer}.{fractional_part}"
    else:
        return formatted_integer

def serialize_data(data: Dict[str, Any], include_columns: List[str] | str = "all"):
    serialized = {}

    if isinstance(include_columns, str) and include_columns == "all":
        include_columns = list(data.keys())

    if not isinstance(include_columns, list):
        include_columns = [include_columns]

    for key, value in data.items():
        if (key not in include_columns):
            continue

        if isinstance(value, (int, float, Decimal)):
            serialized[key] = format_number(value)
        elif isinstance(value, (datetime, date)):
            serialized[key] = value.strftime("%Y-%m-%d")
        else:
            serialized[key] = value
    return serialized