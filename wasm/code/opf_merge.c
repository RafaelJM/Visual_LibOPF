#include "OPF.h"
#include <stdio.h>
#include <emscripten.h>


EMSCRIPTEN_KEEPALIVE
void c_opf_merge(int *argc, char **argv)
{
	EM_ASM(
        FS.syncfs(true, function (err) {
            // Error
        });
    );

	errorOccurred = 0;	

	if ((*argc == 2) || (*argc <= 1))
	{
		fprintf(stderr, "\nusage opf_merge <P1> <P2> ... <Pn>");
		fprintf(stderr, "\nP1: input dataset 1 in the OPF file format");
		fprintf(stderr, "\nP2: input dataset 2 in the OPF file format");
		fprintf(stderr, "\nPn: input dataset n in the OPF file format\n");
		return;
	}
	Subgraph **g = (Subgraph **)malloc(sizeof(Subgraph **) * (*argc - 1)), *merged = NULL, *aux = NULL;
	int i;
	char fileName[512];
	
	fprintf(stdout, "\nReading data sets ...");
	
	for (i = 0; i < *argc - 1; i++){
		g[i] = ReadSubgraph(argv[i + 1]); if(errorOccurred) return;
	}
	fprintf(stdout, " OK");
	

	aux = CopySubgraph(g[0]); if(errorOccurred) return;
	for (i = 1; i < *argc - 1; i++)
	{
		merged = opf_MergeSubgraph(aux, g[i]); if(errorOccurred) return;
		DestroySubgraph(&aux);
		aux = CopySubgraph(merged); if(errorOccurred) return;
		DestroySubgraph(&merged);
	}

	fprintf(stdout, "\nWriting data set to disk ...");
	
	//sprintf(fileName, "%s.merged.dat", argv[1]);
	WriteSubgraph(aux, "merged.dat"); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nDeallocating memory ...");
	for (i = 0; i < *argc - 1; i++)
		DestroySubgraph(&g[i]);
	DestroySubgraph(&aux);
	free(g);
	fprintf(stdout, " OK\n");
	
	EM_ASM(
        FS.syncfs(function (err) {
            // Error
        });
    );
}