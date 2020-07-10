#include "OPF.h"
#include <emscripten.h>

#include <stdio.h>

EMSCRIPTEN_KEEPALIVE
void c_opf_fold(int *argc, char **argv)
{
	EM_ASM(
        FS.syncfs(true, function (err) {
            // Error
        });
    );
	
	errorOccurred = 0;

	if (*argc != 4)
	{
		fprintf(stderr, "\nusage opf_fold <P1> <P2> <P3>");
		fprintf(stderr, "\nP1: input dataset in the OPF file format");
		fprintf(stderr, "\nP2: k");
		fprintf(stderr, "\nP3: normalize features? 1 - Yes  0 - No\n\n");
		return;
	}
	Subgraph *g = NULL, **fold = NULL;
	int k = atoi(argv[2]), i, op = atoi(argv[3]);
	char fileName[255];

	fprintf(stdout, "\nReading data set ...");
	
	g = ReadSubgraph(argv[1]); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nCreating %d folds ...", k);
	
	fold = opf_kFoldSubgraph(g, k); if(errorOccurred) return;
	fprintf(stdout, " OK\n");

	for (i = 0; i < k; i++)
	{
		fprintf(stdout, "\nWriting fold %d ...", i + 1);
			
		sprintf(fileName, "%s%d",argv[1],(i+1));
		if (op){
			opf_NormalizeFeatures(fold[i]); if(errorOccurred) return;
		}
		WriteSubgraph(fold[i], fileName); if(errorOccurred) return;
	}
	fprintf(stdout, " OK\n");

	fprintf(stdout, "\nDeallocating memory ...");
	DestroySubgraph(&g);
	for (i = 0; i < k; i++)
		DestroySubgraph(&fold[i]);
	free(fold);
	fprintf(stdout, " OK\n");
	
	EM_ASM(
        FS.syncfs(function (err) {
            // Error
        });
    );
}