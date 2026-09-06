import os
import sys
import socket
import threading
import time
from pathlib import Path

# Fix sys.path so main can be imported regardless of execution working directory
root_dir = Path(__file__).resolve().parent
if (root_dir / "main.py").exists():
    sys.path.insert(0, str(root_dir))
    os.chdir(str(root_dir))
elif (root_dir / "backend" / "main.py").exists():
    sys.path.insert(0, str(root_dir / "backend"))
    os.chdir(str(root_dir / "backend"))

import uvicorn


def _bridge_port(from_port: int, to_port: int) -> None:
    """Lightweight TCP bridge forwarding incoming connections to the primary uvicorn port."""
    def worker():
        # Wait slightly for uvicorn to bind
        time.sleep(0.5)
        server = None
        try:
            server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            server.bind(("0.0.0.0", from_port))
            server.listen(128)
            print(f"[IGNIS] Port bridge listening on 0.0.0.0:{from_port} -> 127.0.0.1:{to_port}")
            while True:
                client, _ = server.accept()
                def forward(src):
                    dest = None
                    try:
                        dest = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                        dest.connect(("127.0.0.1", to_port))
                        def pipe(a, b):
                            try:
                                while True:
                                    data = a.recv(8192)
                                    if not data:
                                        break
                                    b.sendall(data)
                            except Exception:
                                pass
                            finally:
                                try:
                                    b.shutdown(socket.SHUT_WR)
                                except Exception:
                                    pass

                        threading.Thread(target=pipe, args=(src, dest), daemon=True).start()
                        threading.Thread(target=pipe, args=(dest, src), daemon=True).start()
                    except Exception:
                        try:
                            src.close()
                        except Exception:
                            pass
                        if dest:
                            try:
                                dest.close()
                            except Exception:
                                pass

                threading.Thread(target=forward, args=(client,), daemon=True).start()
        except OSError as e:
            # Port already in use or permission denied; ignore
            print(f"[IGNIS] Port bridge on {from_port} skipped ({e})")
        except Exception as e:
            print(f"[IGNIS] Port bridge on {from_port} error ({e})")
        finally:
            if server:
                try:
                    server.close()
                except Exception:
                    pass

    t = threading.Thread(target=worker, daemon=True)
    t.start()


def main():
    raw_port = os.environ.get("PORT", "").strip()
    try:
        primary_port = int(raw_port)
    except (ValueError, TypeError):
        primary_port = 8080

    print(f"[IGNIS] Primary server starting on port {primary_port}")

    # Set up bridges for other standard ports (8080, 8000, 3000)
    for alt in [8080, 8000, 3000]:
        if alt != primary_port:
            _bridge_port(alt, primary_port)

    # Launch uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=primary_port, log_level="info")


if __name__ == "__main__":
    main()
