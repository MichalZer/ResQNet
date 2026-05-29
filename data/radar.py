import asyncio, math, time, hashlib, threading
from dataclasses import dataclass
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from bleak import BleakScanner

@dataclass
class Dev:
    addr: str; name: str; rssi: int
    last_seen: float; first_seen: float

devices, lock = {}, threading.Lock()

def on_adv(d, adv):
    with lock:
        fs = devices[d.address].first_seen if d.address in devices else time.time()
        devices[d.address] = Dev(
            d.address, d.name or "Unknown", adv.rssi, time.time(), fs
        )

async def scan():
    s = BleakScanner(on_adv)
    await s.start()
    while True:
        await asyncio.sleep(1)

threading.Thread(target=lambda: asyncio.run(scan()), daemon=True).start()

def angle(addr):
    h = int(hashlib.md5(addr.encode()).hexdigest(), 16)
    return (h % 360) * math.pi / 180

def radius(rssi):
    return min(max((-rssi - 30) / 70, 0.05), 1.0)

fig, ax = plt.subplots(subplot_kw={'projection': 'polar'}, figsize=(9, 9))
fig.patch.set_facecolor('#0a0a0a'); ax.set_facecolor('#0a0a0a')

def draw(_):
    ax.clear(); ax.set_facecolor('#0a0a0a')
    ax.set_ylim(0, 1.1); ax.grid(color='#333', alpha=0.5)
    ax.set_yticks([0.25, 0.5, 0.75, 1.0])
    ax.set_yticklabels(['-48', '-65', '-83', '-100 dBm'], color='gray', fontsize=8)
    ax.tick_params(colors='gray')

    now = time.time()
    with lock:
        snap = [d for d in devices.values() if now - d.last_seen <= 30]

    ax.set_title(f"Bluetooth devices nearby — {len(snap)} active",
                 color='white', pad=20)
    ax.scatter([0], [0], s=400, c='cyan', marker='*', zorder=10)

    for d in snap:
        age = now - d.first_seen
        pulse = 1 + 1.5 * (1 - age / 2) if age < 2 else 1.0
        ax.scatter([angle(d.addr)], [radius(d.rssi)],
                   s=200 * pulse, c='#ff6b6b',
                   edgecolors='white', linewidths=1.5, alpha=0.9)
        label = d.name if d.name != "Unknown" else d.addr[-5:]
        ax.annotate(f"{label}\n{d.rssi} dBm",
                    xy=(angle(d.addr), radius(d.rssi)),
                    xytext=(6, 6), textcoords='offset points',
                    color='white', fontsize=8)

ani = animation.FuncAnimation(fig, draw, interval=500, cache_frame_data=False)
plt.show()