#include "OPF.h"
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
void c_opf_accuracy(int *argc, char **argv)
{
	EM_ASM(
        FS.syncfs(true, function (err) {
            // Error
        });
    );
	
	errorOccurred = 0;

	

	if (*argc != 2)
	{
		fprintf(stderr, "\nusage opf_accuracy <P1>");
		fprintf(stderr, "\nP1: data set in the OPF file format");
		return;
	}

	int i, j, **CM = NULL;
	;
	float Acc, tmp;
	FILE *f = NULL;
	char fileName[256];

	fprintf(stdout, "\nReading data file ...");
	
	Subgraph *g = ReadSubgraph(argv[1]); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nReading output file ...");
	
	sprintf(fileName, "%s.out", argv[1]);
	f = fopen(fileName, "r");
	if (!f)
	{
		fprintf(stderr, "\nunable to open file %s", argv[2]);
		return;
	}
	for (i = 0; i < g->nnodes; i++)
		if (fscanf(f, "%d", &g->node[i].label) != 1)
		{
			Error("Error reading node label", "opf_Accuracy"); return;
		}
	fclose(f);
	fprintf(stdout, " OK");
	

	CM = opf_ConfusionMatrix(g);
	for (i = 1; i <= g->nlabels; i++)
	{
		fprintf(stdout, "\n");
		tmp = 0;
		for (j = 1; j <= g->nlabels; j++)
		{
			tmp += CM[i][j];
		}
	}

	for (i = 0; i < g->nlabels + 1; i++)
		free(CM[i]);
	free(CM);

	fprintf(stdout, "\nComputing accuracy ...");
	
	Acc = opf_Accuracy(g); if(errorOccurred) return;
	fprintf(stdout, "\nAccuracy: %.2f%%", Acc * 100);
	

	fprintf(stdout, "\nWriting accuracy in output file ...");
	
	sprintf(fileName, "%s.acc", argv[1]);
	f = fopen(fileName, "a");
	fprintf(f, "%f\n", Acc * 100);
	fclose(f);
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

