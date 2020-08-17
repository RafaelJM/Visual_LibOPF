#include "OPF.h"
#include <stdio.h>
#include <emscripten.h>


EMSCRIPTEN_KEEPALIVE
void c_opf_normalize(int *argc, char **argv)
{
	EM_ASM(
        FS.syncfs(true, function (err) {
            // Error
        });
    );

	errorOccurred = 0;	

	if (*argc != 2)
	{
		fprintf(stderr, "\nusage opf_normalize <P1> <P2>");
		fprintf(stderr, "\nP1: input dataset in the OPF file format");
		return;
	}
	Subgraph *g = NULL;
	char fileName[512];

	fprintf(stdout, "\nReading data set ...");
	
	g = ReadSubgraph(argv[1]); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nNormalizing data set ...");
	
	opf_NormalizeFeatures(g); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nWriting normalized data set to disk ...");
	
	sprintf(fileName, "%s.dat", argv[1]);
	WriteSubgraph(g, fileName); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nDeallocating memory ...");
	DestroySubgraph(&g);
	fprintf(stdout, " OK\n");
	
	EM_ASM(
        FS.syncfs(function (err) {
            // Error
        });
    );
}