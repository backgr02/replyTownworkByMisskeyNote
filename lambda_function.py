import json
import os
import random

from misskey import Misskey


def post(body: dict):
    print("post")
    print(json.dumps(body))

    note = body["body"]["note"]
    user = body["body"]["note"]["user"]

    if "痒い" not in note.get("tags", []):
        return

    # Input instance address (If leaved no attribute, it sets "misskey.io")
    # TODO: Set Misskey token in environment variable to AWS Lambda
    mk = Misskey(
        address="misskey.io",
        i=os.environ["MISSKEY_TOKEN"],
    )

    comment_list = [
        "そんな時は、タウンワーク！🐖",
        "かゆみ止めには、タウンワーク！🐖",
        "タウンワークがあるじゃないか！🐖",
        "タウンワーク、多め！🐖🐖",
        "タウンワーク、マシマシ！！🐖🐖🐖🐖",
        "つ「タウンワーク」🐖",
        "TOWNWORK なんだ！🐖",
        "そんな時にタウンワークが便利なんですよ。🐖",
        "ちょうどタウンワーク持ってた。あげる。🐖",
        "掻いてあげる",
        "ごめん、タウンページしかない。 (´・_・`)",
        "こっちがサンキューって言いたいよ。\nかゆみ止めには、タウンワーク！🐖",
        "かゆみ止めアプリは、タウンワーク！🐖",
    ]
    comment = comment_list[random.randrange(len(comment_list))]

    username = f"@{user['username']}" if user["username"] else ""
    host = f"@{user['host']}" if user["host"] else ""

    # Let's note!
    mk.notes_create(
        text=f"{username}{host} {comment}",
        reply_id=note["id"],
        visibility=note["visibility"],
    )


def lambda_handler(event, context):
    print(json.dumps(event))
    print(context)
    body = json.loads(event["body"])
    post(body)
    return {"statusCode": 200, "body": json.dumps("Hello from Lambda!")}
