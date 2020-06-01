sed -i '1i\ /* eslint-disable */\n' ping.js

sed -i "s|ping.wasm|/ping.wasm|" ping.js

sed -i "s|wasmBinaryFile = locateFile|// wasmBinaryFile = locateFile|" ping.js

PAUSE