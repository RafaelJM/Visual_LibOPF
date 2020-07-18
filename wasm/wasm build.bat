emcc -O2 code/util/common.c -o obj/common.o -I./include/util
emcc -O2 code/util/gqueue.c -o obj/gqueue.o -I./include/util
emcc -O2 code/util/realheap.c -o obj/realheap.o -I./include/util
emcc -O2 code/util/set.c -o obj/set.o -I./include/util
emcc -O2 code/util/sgctree.c -o obj/sgctree.o -I./include/util
emcc -O2 code/util/subgraph.c -o obj/subgraph.o -I./include/util
emcc -O2 code/OPF.c -o obj/OPF.o -I./include/util -I./include

emar csr ./obj/libOPF.a ./obj/common.o ./obj/set.o ./obj/gqueue.o ./obj/realheap.o ./obj/sgctree.o ./obj/subgraph.o ./obj/OPF.o

emcc code/opf_accuracy.c code/opf_accuracy4label.c code/opf_classify.c code/opf_cluster.c code/opf_distance.c code/opf_fold.c code/opf_info.c code/opf_learn.c code/opf_merge.c code/opf_normalize.c code/opf_pruning.c code/opf_semi.c code/opf_split.c code/opf_train.c code/opfknn_classify.c code/opfknn_train.c -o libopf.js -I./include/util -I./include -L./obj -lOPF -lm -s TOTAL_MEMORY=33554432 -s WASM=1 --bind -s MODULARIZE=1 -s ENVIRONMENT=web -s USE_PTHREADS=0 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap', 'FS', 'stringToUTF8', 'setValue']" -lidbfs.js --preload-file files/0.temp --preload-file files/1.temp --preload-file files/2.temp --preload-file files/3.temp --preload-file files/4.temp