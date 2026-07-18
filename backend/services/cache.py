import time
from typing import Callable, TypeVar

T = TypeVar("T")

_store: dict[str, tuple[float, object]] = {}


def get_or_set(key: str, ttl_seconds: float, compute: Callable[[], T]) -> T:
    entry = _store.get(key)
    if entry is not None:
        expires_at, value = entry
        if expires_at > time.time():
            return value  # type: ignore[return-value]
        del _store[key]

    value = compute()
    _store[key] = (time.time() + ttl_seconds, value)
    return value
