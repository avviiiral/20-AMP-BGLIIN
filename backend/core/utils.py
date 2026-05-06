from datetime import datetime
from core.config import SHIFT_ENABLED, SHIFT_START, SHIFT_END

def is_within_shift():
    if not SHIFT_ENABLED:
        return True

    now = datetime.now().time()

    # normal shift
    if SHIFT_START < SHIFT_END:
        return SHIFT_START <= now <= SHIFT_END

    # overnight shift
    else:
        return now >= SHIFT_START or now <= SHIFT_END