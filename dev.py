import subprocess, sys, signal, os, time
procs=[
    subprocess.Popen([sys.executable,"-m","uvicorn","backend.main:app","--host","127.0.0.1","--port","8000"]),
    subprocess.Popen(["npm","run","dev:frontend"]),
]
def stop(*_):
    for p in procs:
        if p.poll() is None: p.terminate()
    raise SystemExit
signal.signal(signal.SIGINT, stop)
signal.signal(signal.SIGTERM, stop)
try:
    while all(p.poll() is None for p in procs):
        time.sleep(0.5)
finally:
    stop()
