import datetime
import json
import requests
import random
import time
import os

tag = "🍎🍎 Runner 🍎"
count = 0
start_time = time.time()
elapsed_time = 0

def update_batch(batch_id):
    posted = True
    url = f"{URL}updateBatch"
    m = {'batch_id': batch_id, 'posted': posted}
    data = json.dumps(m)
    try:
        print(f"{tag} setting posted to True for batch: {batch_id} ...")
        response = requests.post(url=url, data=data)
        if response.status_code == 200:
            print(f"{tag} update_batch 🥬🥬🥬 Request successful")
        else:
            print(f"{tag} Request failed with status code: {response.status_code}")
            print(f"{tag} RESPONSE: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"{tag} An error occurred: {e}")

def add_transactions(batch_id):

    tx_count = random.randint(1, 15)
    txs = []
    for i in range(tx_count):
        sub_total = random.randint(10, 100) * 100
        total = sub_total * 1.15
        discount = random.randint(0, 5)
        milliseconds = int(round(time.time() * 1000))
        milliseconds = milliseconds + random.randint(500, 50000)
        batch_transaction_id = str(milliseconds)

        tx = {
            "batch_transaction_id": batch_transaction_id,
            "batch_id": batch_id,
            "booking_date": str(time.ctime()),
            "value_date": str(time.ctime()),
            "remittance_info": "Remittance Info",
            "reference": "REF 1234",
            "discount": discount,
            "amount": total,
            "posted": False,
            "credit_debit_indicator": "?"
        }

        txs.append(tx)

    data = json.dumps(txs)
    url = f"{URL}addBatchTransactions"

    try:
        print(f"{tag} adding {tx_count} transactions to batch {batch_id} ...")
        response = requests.post(url=url, data=data)
        if response.status_code == 200:
            print(f"{tag} addBatchTransactions 🥬🥬🥬 Request successful")
            update_batch(batch_id=batch_id)
        else:
            print(f"{tag} Request failed with status code: {response.status_code}")
            print(f"{tag} RESPONSE: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"{tag} An error occurred: {e}")


URL = "http://localhost:7071/api/"

def add_batch():
    names = [
        "Aubrey",
        "Tiger",
        "Beauty",
        "Bobby",
        "Bra Don",
        "Bra Syd",
        "Khaya",
        "Kassambe",
        "Ouma Rustenburg",
        "Ouma Midrand",
        "Dlamani",
        "Sis Zandi",
        'Sis Lucy',
        'Vukosi',
    ]

    name = random.choice(names)

    url = f"{URL}addBatch"
    curr = str(time.ctime())
    sub_total = random.randint(10, 100) * 100
    total = sub_total * 1.15
    discount = random.randint(0, 5)
    milliseconds = int(round(time.time() * 1000))
    batch_id = str(milliseconds)
    
    batch = {
        "batch_id": batch_id,
        "batch_date": curr,
        "sub_total": sub_total,
        "total": total,
        "branch_code": "BR001",
        "operator_name": name,
        "discount": discount,
    }
    
    data = json.dumps(batch)
    try:
        response = requests.post(url=url, data=data)
        if response.status_code == 200:
            print(f"{tag} addBatch Request successful, 🥬🥬🥬 will add transactions")
            add_transactions(batch_id=batch_id)
        else:
            print(f"{tag} Request failed with status code: {response.status_code}")
            print(f"{tag} RESPONSE: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"{tag} An error occurred: {e}")


def run_code():
    add_batch()
    time_x = time.strftime("%H:%M:%S")
    print(f"\n{tag} Runner ran lap #{count + 1} at: 💛 💛 💛 {time_x}\n\n")


while elapsed_time < 3600:  # Run for a maximum of 1 hour (3600 seconds)
    random_interval = random.randint(5, 30)
    num = "{:.2f}".format(elapsed_time / 60)
    min = "{:.2f}".format(elapsed_time)
    print(
        f"{tag} Current elapsed time : 🅿️ 🅿️ 🅿️  {num} minutes 🅿️ 🅿️ 🅿️  total_elapsed seconds: 💦 {min} 💦"
    )
    print(f"{tag} Runner processing a nap for 🔵 {random_interval} seconds 🔵 ...")
    time.sleep(random_interval)

    print(f"{tag} Runner woke up after hibernating for {random_interval} seconds ...")

    run_code()
    elapsed_time = time.time() - start_time

#
print(f"\n\n{tag} 🅿️🅿️🅿️ Runner ran {count} laps around the track 🅿️🅿️🅿️")
print(f"{tag} 🅿️🅿️🅿️ Runner exhausted after running a marathon!!! 🅿️🅿️🅿️")
