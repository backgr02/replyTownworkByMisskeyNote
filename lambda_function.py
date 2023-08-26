import json

from misskey import Misskey

def post(body: dict):
    print("post")
    print(json.dumps(body))

    note = body['body']['note']
    user = body['body']['note']['user']

    if ("痒い" not in note.get('tags', [])):
        return

    # Input instance address (If leaved no attribute, it sets "misskey.io")
    mk = Misskey(
        address = "misskey.io",
        i       = "token", #FIXME: token
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


# def test():
#     print("test")
#     body = json.loads('{"hookId":"9iusl425pe","userId":"9d6emxmmgw","eventId":"5b0a5279-32ff-4adc-af54-5b816e78ae96","createdAt":1693006528526,"type":"mention","body":{"note":{"id":"9iusor0et7","createdAt":"2023-08-25T23:35:28.190Z","userId":"9d6emxmmgw","user":{"id":"9d6emxmmgw","name":":_mi::_zo::_ti::_n:(๑╹ω╹๑)","username":"backgr02","host":null,"avatarUrl":"https://proxy.misskeyusercontent.com/avatar.webp?url=https%3A%2F%2Fs3.arkjp.net%2Fmisskey%2Fwebpublic-1af0d1ad-68eb-4086-9c93-142e35949f7b.webp&avatar=1","avatarBlurhash":"eHMbO:?I0vBxpoUNKZ,Kx@sVCWH^^Axuik~WTV9YRjVuIC-;$SIoxa","isBot":false,"isCat":true,"emojis":{},"onlineStatus":"online","badgeRoles":[{"name":"FANBOX サポーター","iconUrl":"https://s3.arkjp.net/misskey/6e3b469e-16ed-4cc2-9098-215b441da254.png","displayOrder":0}]},"text":"**:ablobcatblink: 歯痒いにゃー**\\nhttps://misskey.io/play/9iuojjiewk\\n@backgr02 #痒い","cw":null,"visibility":"public","localOnly":false,"reactionAcceptance":"nonSensitiveOnly","renoteCount":0,"repliesCount":0,"reactions":{},"reactionEmojis":{},"tags":["痒い"],"fileIds":[],"files":[],"replyId":null,"renoteId":null,"mentions":["9d6emxmmgw"]}}}')
#     post(body)


# test()
