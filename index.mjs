import * as Misskey from "misskey-js";

const comment_list = [
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
];

async function post(body) {
  console.log(JSON.stringify(body));

  const note = body.body.note;
  const user = body.body.note.user;

  if (!note.tags?.includes("痒い")) {
    return {};
  }

  const cli = new Misskey.api.APIClient({
    origin: process.env.MISSKEY_URI,
    credential: process.env.MISSKEY_TOKEN,
  });

  const comment = comment_list[Math.floor(Math.random() * comment_list.length)];
  const host = user?.host ? `@${user.host}` : "";

  return await cli.request("notes/create", {
    text: `@${user.username}${host} ${comment}`,
    replyId: note.id,
    visibility: note.visibility,
  });
}

export const handler = async (event, _context) => {
  console.log(JSON.stringify(event));
  const statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };
  const response = await post(JSON.parse(event.body));

  console.log(JSON.stringify(response));
  return {
    statusCode: statusCode,
    body: JSON.stringify(response, null, 2),
    headers: headers,
  };
};
