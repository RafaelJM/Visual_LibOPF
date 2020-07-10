sed -i '1i\ /* eslint-disable */\n' libopf.js

sed -i "s|ping.wasm|/ping.wasm|" libopf.js

sed -i "s|wasmBinaryFile = locateFile|// wasmBinaryFile = locateFile|" libopf.js

PAUSE