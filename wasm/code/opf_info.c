#include "OPF.h"
#include <stdio.h>
#include <time.h>
#include <emscripten.h>


EMSCRIPTEN_KEEPALIVE
void c_opf_info(int *argc, char **argv)
{
	EM_ASM(
        FS.syncfs(true, function (err) {
            // Error
        });
    );
	
	errorOccurred = 0;	

	if (*argc != 2)
	{
		fprintf(stderr, "\nusage opf_info <P1>");
		fprintf(stderr, "\nP1: OPF file\n");
		return;
	}

	Subgraph *g = NULL;
	FILE *fp = NULL;
	int ndata, nfeats, nlabels;
	char msg[128];

	if ((fp = fopen(argv[1], "rb")) == NULL)
	{
		sprintf(msg, "%s%s", "Unable to open file ", argv[1]);
		Error(msg, "opf_info"); return;
	}

	if (fread(&ndata, sizeof(int), 1, fp) != 1)
	{
		fprintf(stderr, "\n Could not read number of samples");
		return;
	}
	if (fread(&nlabels, sizeof(int), 1, fp) != 1)
	{
		fprintf(stderr, "\n Could not read number of labels");
		return;
	}

	if (fread(&nfeats, sizeof(int), 1, fp) != 1)
	{
		fprintf(stderr, "\n Could not read number of features");
		return;
	}

	fprintf(stdout, "\nInformations about %s file\n --------------------------------", argv[1]);
	fprintf(stdout, "\nData size: %d", ndata);
	fprintf(stdout, "\nFeatures size: %d", nfeats);
	fprintf(stdout, "\nLabels number: %d", nlabels);
	fprintf(stdout, "\n--------------------------------\n");

	DestroySubgraph(&g);
	fclose(fp);
	
	EM_ASM(
        FS.syncfs(function (err) {
            // Error
        });
    );
}