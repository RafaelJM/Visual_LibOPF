#include "OPF.h"
#include <emscripten.h>


EMSCRIPTEN_KEEPALIVE
void c_opf_train(int *argc, char **argv)
{
	EM_ASM(
        FS.syncfs(true, function (err) {
            // Error
        });
    );

	errorOccurred = 0;
	opf_PrecomputedDistance = 0;

	if ((*argc != 3) && (*argc != 2))
	{
		fprintf(stderr, "\nusage opf_train <P1> <P2>");
		fprintf(stderr, "\nP1: training set in the OPF file format");
		fprintf(stderr, "\nP2: precomputed distance file (leave it in blank if you are not using this resource)\n");
		return;
	}

	int n, i, p;
	char fileName[256];
	FILE *f = NULL;
	timer tic, toc;
	float time;

	if (*argc == 3)
		opf_PrecomputedDistance = 1;

	fprintf(stdout, "\nReading data file ...");
	
	Subgraph *g = ReadSubgraph(argv[1]); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	if (opf_PrecomputedDistance){
		opf_DistanceValue = opf_ReadDistances(argv[2], &n); if(errorOccurred) return;
		int maxPosition = 0;
		for (p = 0; p < g->nnodes; p++)
		{
			if(g->node[p].position > maxPosition)
				maxPosition = g->node[p].position;
		}
		if(maxPosition >= n){
			errorOccurred = 1;
			fprintf(stderr, "\nError! Some positions have no pre-calculated distance, the matrix size must be equal to or less than the maximum position of the nodes");
			return;
		}
	}

	fprintf(stdout, "\nTraining OPF classifier ...");
	
	gettimeofday(&tic, NULL);
	opf_OPFTraining(g); if(errorOccurred) return;
	gettimeofday(&toc, NULL);
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nWriting classifier's model file ...");
	
	sprintf(fileName, "%s.cla", argv[1]);
	opf_WriteModelFile(g, fileName);
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nWriting output file ...");
	
	sprintf(fileName, "%s.out", argv[1]);
	opf_WriteOutputFile(g, fileName);
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nDeallocating memory ...");
	
	DestroySubgraph(&g);
	if (opf_PrecomputedDistance)
	{
		for (i = 0; i < n; i++)
			free(opf_DistanceValue[i]);
		free(opf_DistanceValue);
	}
	fprintf(stdout, " OK\n");

	time = ((toc.tv_sec - tic.tv_sec) * 1000.0 + (toc.tv_usec - tic.tv_usec) * 0.001) / 1000.0;
	fprintf(stdout, "\nTraining time: %f seconds\n", time);
	

	sprintf(fileName, "%s.tim", argv[1]);
	f = fopen(fileName, "a");
	fprintf(f, "%f\n", time);
	fclose(f);
	
	EM_ASM(
        FS.syncfs(function (err) {
            // Error
        });
    );
}