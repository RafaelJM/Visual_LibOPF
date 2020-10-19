#include "OPF.h"
#include <emscripten.h>


EMSCRIPTEN_KEEPALIVE
void c_opf_pruning(int *argc, char **argv)
{
	EM_ASM(
        FS.syncfs(true, function (err) {
            // Error
        });
    );

	errorOccurred = 0;	
	opf_PrecomputedDistance = 0;
	if ((*argc != 5) && (*argc != 4))
	{
		fprintf(stderr, "\nusage opf_pruning <P1> <P2> <P3> <P4>");
		fprintf(stderr, "\nP1: training set in the OPF file format");
		fprintf(stderr, "\nP2: evaluating set in the OPF file format");
		fprintf(stderr, "\nP3: percentage of accuracy [0,1]");
		fprintf(stderr, "\nP4: precomputed distance file (leave it in blank if you are not using this resource\n");
		return;
	}

	int n, i, isize, fsize;
	float time, desiredAcc = atof(argv[3]), prate;
	char fileName[256];
	FILE *f = NULL;
	timer tic, toc;

	if (*argc == 5)
		opf_PrecomputedDistance = 1;
	fprintf(stdout, "\nReading data files ...");
	
	Subgraph *gTrain = ReadSubgraph(argv[1]), *gEval = ReadSubgraph(argv[2]); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	if (opf_PrecomputedDistance){
		opf_DistanceValue = opf_ReadDistances(argv[4], &n); if(errorOccurred) return;
	}

	isize = gTrain->nnodes;
	fprintf(stdout, "\nPruning training set ...");
	
	gettimeofday(&tic, NULL);
	opf_OPFPruning(&gTrain, &gEval, desiredAcc); if(errorOccurred) return;
	gettimeofday(&toc, NULL);
	fprintf(stdout, " OK");
	
	fsize = gTrain->nnodes;

	prate = (1 - fsize / (float)isize) * 100;
	fprintf(stdout, "\nFinal pruning rate: %.2f%%", prate);
	

	fprintf(stdout, "\n\nWriting classifier's model file ...");
	
	sprintf(fileName, "%s.cla", argv[1]);
	opf_WriteModelFile(gTrain, fileName);
	fprintf(stdout, " OK");
	
	fprintf(stdout, " OK");
	
	sprintf(fileName, "%s.pra", argv[1]);
	f = fopen(fileName, "a");
	fprintf(f, "%f\n", prate);
	fclose(f);

	time = ((toc.tv_sec - tic.tv_sec) * 1000.0 + (toc.tv_usec - tic.tv_usec) * 0.001) / 1000.0;
	fprintf(stdout, "\nPruning time: %f seconds\n", time);
	
	sprintf(fileName, "%s.tim", argv[1]);
	f = fopen(fileName, "a");
	fprintf(f, "%f\n", time);
	fclose(f);

	fprintf(stdout, "\nDeallocating memory ...");
	DestroySubgraph(&gTrain);
	DestroySubgraph(&gEval);
	if (opf_PrecomputedDistance)
	{
		for (i = 0; i < n; i++)
			free(opf_DistanceValue[i]);
		free(opf_DistanceValue);
	}
	fprintf(stdout, " OK\n");
	
	EM_ASM(
        FS.syncfs(function (err) {
            // Error
        });
    );
}