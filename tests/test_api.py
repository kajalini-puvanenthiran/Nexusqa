import requests

BASE = "http://localhost:8000"

def test_flow():
    # 1. Login
    print("Attempting login...")
    r = requests.post(f"{BASE}/auth/login", json={
        "email": "kajip1998@gmail.com",
        "password": "kajiP@2026"
    })
    if r.status_code != 200:
        print(f"Login failed: {r.status_code} {r.text}")
        return
    
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login success.")

    # 2. Start Scan
    print("Attempting scan...")
    r = requests.post(f"{BASE}/scans/", json={
        "url": "https://google.com",
        "target_type": "website",
        "mode": "full"
    }, headers=headers)
    
    if r.status_code != 200:
        print(f"Scan failed: {r.status_code} {r.text}")
    else:
        print("Scan success:")
        print(r.json())

if __name__ == "__main__":
    test_flow()
