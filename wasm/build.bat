emcc -O2 code/util/common.c -o obj/common.o -I./include/util
emcc -O2 code/util/gqueue.c -o obj/gqueue.o -I./include/util
emcc -O2 code/util/realheap.c -o obj/realheap.o -I./include/util
emcc -O2 code/util/set.c -o obj/set.o -I./include/util
emcc -O2 code/util/sgctree.c -o obj/sgctree.o -I./include/util
emcc -O2 code/util/subgraph.c -o obj/subgraph.o -I./include/util
emcc -O2 code/OPF.c -o obj/OPF.o -I./include/util -I./include

emar csr ./obj/libOPF.a ./obj/common.o ./obj/set.o ./obj/gqueue.o ./obj/realheap.o ./obj/sgctree.o ./obj/subgraph.o ./obj/OPF.o

emcc code/opf_split.c -o ping.js -I./include/util -I./include -L./obj -lOPF -lm -s TOTAL_MEMORY=33554432 -s WASM=1 --bind -s MODULARIZE=1 -s ENVIRONMENT=web -s USE_PTHREADS=0 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap', 'FS', 'stringToUTF8', 'setValue']" -lidbfs.js --preload-file files/auxone.dat