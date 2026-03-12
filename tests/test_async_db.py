import asyncio, aiomysql, os
from dotenv import load_dotenv

load_dotenv()
DB_PORT = int(os.getenv("DB_PORT", 5566))

async def test():
    print(f"Testing aiomysql on port {DB_PORT}...")
    try:
        conn = await aiomysql.connect(host='127.0.0.1', port=DB_PORT, user='root', db='nexusqa')
        print("aiomysql connection successful")
        conn.close()
    except Exception as e:
        print(f"aiomysql connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test())
