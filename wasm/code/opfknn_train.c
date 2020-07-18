#include "OPF.h"
#include <emscripten.h>


EMSCRIPTEN_KEEPALIVE
void c_opfknn_train(int *argc, char **argv)
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
		fprintf(stderr, "\nusage opf_train <P1> <P2>");
		fprintf(stderr, "\nP1: training set in the OPF file format");
		fprintf(stderr, "\nP2: evaluating set in the OPF file format (used to learn k)");
		fprintf(stderr, "\nP3: kmax");
		fprintf(stderr, "\nP4: precomputed distance file (leave it in blank if you are not using this resource)\n");
		return;
	}

	int n, i, kmax = atoi(argv[3]);
	char fileName[256];
	FILE *f = NULL;
	timer tic, toc;
	double time;

	if (*argc == 5)
		opf_PrecomputedDistance = 1;

	fprintf(stdout, "\nReading data file ...");
	
	Subgraph *Train = ReadSubgraph(argv[1]); if(errorOccurred) return;
	Subgraph *Eval = ReadSubgraph(argv[2]); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	if (opf_PrecomputedDistance){
		opf_DistanceValue = opf_ReadDistances(argv[4], &n); if(errorOccurred) return;
	}

	fprintf(stdout, "\nTraining OPF classifier ...");
	
	gettimeofday(&tic, NULL);
	opf_OPFknnTraining(Train, Eval, kmax); if(errorOccurred) return;
	gettimeofday(&toc, NULL);
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nWriting classifier's model file ...");
	
	//sprintf(fileName, "%s.classifier.opf", argv[1]);
	opf_WriteModelFile(Train, "classifier.opf");
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nWriting output file ...");
	
	sprintf(fileName, "%s.out", argv[1]);
	opf_WriteOutputFile(Train, fileName);
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nDeallocating memory ...");
	
	DestroySubgraph(&Train);
	DestroySubgraph(&Eval);
	if (opf_PrecomputedDistance)
	{
		for (i = 0; i < n; i++)
			free(opf_DistanceValue[i]);
		free(opf_DistanceValue);
	}
	fprintf(stdout, " OK\n");

	time = ((toc.tv_sec - tic.tv_sec) * 1000.0 + (toc.tv_usec - tic.tv_usec) * 0.001) / 1000.0;
	fprintf(stdout, "\nTraining time: %f seconds\n", time);
	

	sprintf(fileName, "%s.time", argv[1]);
	f = fopen(fileName, "a");
	fprintf(f, "%f\n", time);
	fclose(f);
	
	EM_ASM(
        FS.syncfs(function (err) {
            // Error
        });
    );
}