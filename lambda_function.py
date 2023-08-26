import json
import os

from misskey import Misskey

def post(body: dict):
    print("post")
    print(json.dumps(body))

    note = body['body']['note']
    user = body['body']['note']['user']

    if ("痒い" not in note.get('tags', [])):
        return

    # Input instance address (If leaved no attribute, it sets "misskey.io")
    #TODO: Set Misskey token in environment variable to AWS Lambda
    mk = Misskey(
        address = "misskey.io",
        i       = os.environ['MISSKEY_TOKEN'],
    )

    # Let's note!
    mk.notes_create(
        text     = f"@{user['username']} そんな時は、タウンワーク！🐖",
        reply_id = note['id'],
    )


def lambda_handler(event, context):
    print(json.dumps(event))
    print(context)
    body = json.loads(event['body'])
    post(body)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
