#/usr/bin/env bash
set -euxo pipefail
cd "$(dirname "$0")"

source .venv/bin/activate
pip install -r requirements.txt -t .
rm -f ../replyTownworkByMisskeyNote.zip
zip -r ../replyTownworkByMisskeyNote.zip *
