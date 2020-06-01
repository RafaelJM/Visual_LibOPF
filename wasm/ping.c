// Copyright 2012 The Emscripten Authors.  All rights reserved.
// Emscripten is available under two separate licenses, the MIT license and the
// University of Illinois/NCSA Open Source License.  Both these licenses can be
// found in the LICENSE file.

#include <stdio.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int file() {
	EM_ASM(
        FS.syncfs(true, function (err) {
            // Error
        });
    );
	
    FILE *fh;
	
    fh = fopen("/files/auxone.dat","r");
	if (!fh) return(1);
	fclose(fh);
	
	fh = fopen("/files/auxone.dat","w");
	if (!fh) return(2);
	
    char data[] = "foobar";
    size_t written = fwrite(data, 1, sizeof(data), fh);
	
	fclose(fh);
	return(100);
    printf("written=%zu\n", written);
	
	EM_ASM(
        FS.syncfs(function (err) {
            // Error
        });
    );
}

/*
#include <stdio.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int file() {
    // EM_ASM is a macro to call in-line JavaScript code.
	
    EM_ASM(
        // Make a directory other than '/'
        FS.mkdir('/offline');

        // Then mount with IDBFS type
        FS.mount(IDBFS, {}, '/offline');
		
		FS.writeFile('/offline/any_file.txt', "");
		
        // Then sync
        FS.syncfs(true, function (err) {
            // Error
        });
    );

    // Use fopen / write / fclose in C here.
    FILE *f = fopen("/offline/any_file.txt","rw");
	if (f == NULL) {
		return 0;
	}
	fprintf(f, "Some text");
	fclose(f);

    // Don't forget to sync to make sure you store it to IndexedDB
    EM_ASM(
        FS.syncfs(function (err) {
            // Error
        });
    );
	return(2);
}
*/