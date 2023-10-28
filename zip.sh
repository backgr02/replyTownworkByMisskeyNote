#!/usr/bin/env bash
set -euxo pipefail
cd "$(dirname "$0")"

# shellcheck source=/dev/null
source venv/bin/activate

pip install --requirement requirements.txt --target ./package
rm -f "${1}"

cd package
zip -r "../${1}" .

cd ..
zip "${1}" lambda_function.py
