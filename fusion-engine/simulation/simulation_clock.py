SIMULATION_TIMES = ["10:40", "10:42", "10:43", "10:45"]

current_index = 0
is_running = False


def get_current_time():
    return SIMULATION_TIMES[current_index]


def get_simulation_status():
    return {
        "currentTime": get_current_time(),
        "isRunning": is_running,
        "availableTimes": SIMULATION_TIMES
    }


def start_simulation():
    global is_running, current_index
    is_running = True
    current_index = 0

    return get_simulation_status()


def stop_simulation():
    global is_running
    is_running = False

    return get_simulation_status()


def reset_simulation():
    global current_index, is_running
    current_index = 0
    is_running = False

    return get_simulation_status()


def advance_time():
    global current_index

    if current_index < len(SIMULATION_TIMES) - 1:
        current_index += 1

    return get_simulation_status()