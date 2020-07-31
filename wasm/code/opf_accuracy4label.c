#include "OPF.h"
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
void c_opf_accuracy4label(int *argc, char **argv)
{
	EM_ASM(
        FS.syncfs(true, function (err) {
            // Error
        });
    );
	
	errorOccurred = 0;	

	if (*argc != 3)
	{
		fprintf(stderr, "\nusage opf_accuracy <P1> <P2>");
		fprintf(stderr, "\nP1: data set in the OPF file format");
		fprintf(stderr, "\nP2: classification file");
		return;
	}

	int i;
	float *Acc = NULL;
	FILE *f = NULL;
	char fileName[256];

	fprintf(stdout, "\nReading data file ...");
	
	Subgraph *g = ReadSubgraph(argv[1]); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nReading output file ...");
	
	//sprintf(fileName, "%s.out", argv[1]);
	f = fopen(argv[2], "r");
	if (!f)
	{
		fprintf(stderr, "\nunable to open file %s", argv[2]);
		return;
	}

	for (i = 0; i < g->nnodes; i++)
	{
		if (fscanf(f, "%d", &g->node[i].label) != 1)
		{
			Error("Error reading node label", "opf_Accuracy"); return;
		}
	}
	fclose(f);
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nComputing accuracy ...");
	
	Acc = opf_Accuracy4Label(g); if(errorOccurred) return;
	for (i = 1; i <= g->nlabels; i++)
		fprintf(stdout, "\nClass %d: %.2f%%", i, Acc[i] * 100);
	

	fprintf(stdout, "\nWriting accuracy in output file ...");
	
	sprintf(fileName, "%s.acc", argv[1]);
	f = fopen(fileName, "a");
	for (i = 1; i <= g->nlabels; i++)
	{
		fprintf(f, "%f", Acc[i] * 100);
		fprintf(f, "\n");
	}
	fprintf(f, "\n");
	fclose(f);
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nDeallocating memory ...");
	
	DestroySubgraph(&g);
	fprintf(stdout, " OK\n");

	free(Acc);
	
	EM_ASM(
        FS.syncfs(function (err) {
            // Error
        });
    );
}