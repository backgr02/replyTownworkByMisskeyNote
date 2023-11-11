import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import * as Misskey from "misskey-js";

const misskeyAPIClient = new Misskey.api.APIClient({
  origin: process.env.MISSKEY_URI,
  credential: process.env.MISSKEY_TOKEN,
});

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

const tableName = process.env.DYNAMODB_TABLE_NAME;

const commentNoTownworkList = [
  { text: "ごめん、タウンページしかない。 (´・_・`)", num: 0 },
  { text: "タウンワーク入荷しました！🚚", num: 5 },
  { text: "タウンワーク入荷しました！🚚🚚", num: 10 },
];

const commentList = [
  { text: "そんな時は、タウンワーク！🐖", num: -1 },
  { text: "かゆみ止めには、タウンワーク！🐖", num: -1 },
  { text: "タウンワークがあるじゃないか！🐖", num: -1 },
  { text: "タウンワーク、多め！🐖🐖", num: -2 },
  { text: "タウンワーク、マシマシ！！🐖🐖🐖🐖", num: -4 },
  { text: "つ「タウンワーク」🐖", num: -1 },
  { text: "TOWNWORK なんだ！🐖", num: -1 },
  { text: "そんな時にタウンワークが便利なんですよ。🐖", num: -1 },
  { text: "ちょうどタウンワーク持ってた。あげる。🐖", num: -1 },
  { text: "掻いてあげる", num: 0 },
  {
    text: "こっちがサンキューって言いたいよ。\nかゆみ止めには、タウンワーク！🐖",
    num: -1,
  },
  { text: "かゆみ止めアプリは、タウンワーク！🐖", num: -1 },
];

async function popTownwork() {
  const info = await dynamo.send(new GetCommand({ TableName: tableName, Key: { id: "townwork_info" } }));
  let stock = info.Item?.stock == null ? 0 : info.Item.stock;
  let comment = commentList[Math.floor(Math.random() * commentList.length)];
  console.log(JSON.stringify({ stock: stock, num: comment.num }));
  if (stock + comment.num < 0) {
    comment = commentNoTownworkList[Math.floor(Math.random() * commentNoTownworkList.length)];
    console.log(JSON.stringify({ stock: stock, num: comment.num }));
  }
  stock += comment.num;

  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: { id: "townwork_info", stock: stock },
    })
  );

  return `${comment.text}\n残り： ${stock.toLocaleString()} タウンワーク`;
}

async function followed(body) {
  return await createFollowing(body.body.user.id);
}

async function createFollowing(userId) {
  return await misskeyAPIClient.request("following/create", { userId: userId });
}

async function mention(body) {
  const note = body.body.note;
  const user = body.body.note.user;

  if (!note.tags?.includes("痒い")) {
    return {};
  }

  const host = user?.host ? `@${user.host}` : "";

  return await misskeyAPIClient.request("notes/create", {
    text: `@${user.username}${host} ${await popTownwork()}`,
    replyId: note.id,
    visibility: note.visibility,
  });
}

export const handler = async (event, _context) => {
  try {
    console.log(JSON.stringify(event));
    const headers = {
      "Content-Type": "application/json",
    };
    let response = {};
    const body = JSON.parse(event.body);
    console.log(JSON.stringify(body));
    if (body.type === "mention") {
      response = await mention(body);
    } else if (body.type === "followed") {
      response = await followed(body);
    } else {
      response = { a: body.type };
    }

    console.log(JSON.stringify(response));
    return {
      statusCode: 200,
      body: JSON.stringify(response, null, 2),
      headers: headers,
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(err.message, null, 2),
      headers: headers,
    };
  }
};
