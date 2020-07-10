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

	if (*argc != 3)
	{
		fprintf(stderr, "\nusage opf_normalize <P1> <P2>");
		fprintf(stderr, "\nP1: input dataset in the OPF file format");
		fprintf(stderr, "\nP2: normalized output dataset in the OPF file format\n");
		return;
	}
	Subgraph *g = NULL;

	fprintf(stdout, "\nReading data set ...");
	
	g = ReadSubgraph(argv[1]); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nNormalizing data set ...");
	
	opf_NormalizeFeatures(g); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nWriting normalized data set to disk ...");
	
	WriteSubgraph(g, argv[2]); if(errorOccurred) return;
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