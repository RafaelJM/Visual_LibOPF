#include "OPF.h"
#include <emscripten.h>


EMSCRIPTEN_KEEPALIVE
void c_opf_learn(int *argc, char **argv)
{
	EM_ASM(
        FS.syncfs(true, function (err) {
            // Error
        });
    );

	errorOccurred = 0;	
	opf_PrecomputedDistance = 0;
	if ((*argc != 3) && (*argc != 4))
	{
		fprintf(stderr, "\nusage opf_learn <P1> <P2> <P3>");
		fprintf(stderr, "\nP1: training set in the OPF file format");
		fprintf(stderr, "\nP2: evaluation set in the OPF file format");
		fprintf(stderr, "\nP3: precomputed distance file (leave it in blank if you are not using this resource\n");
		return;
	}

	float Acc, time;
	char fileName[512];
	int i, n;
	timer tic, toc;
	FILE *f = NULL;

	if (*argc == 4)
		opf_PrecomputedDistance = 1;
	fprintf(stdout, "\nReading data file ...");
	
	Subgraph *gTrain = ReadSubgraph(argv[1]), *gEval = ReadSubgraph(argv[2]); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	if (opf_PrecomputedDistance){
		opf_DistanceValue = opf_ReadDistances(argv[3], &n); if(errorOccurred) return;
	}

	fprintf(stdout, "\nLearning from errors in the evaluation set...");
	
	gettimeofday(&tic, NULL);
	opf_OPFLearning(&gTrain, &gEval); if(errorOccurred) return;
	gettimeofday(&toc, NULL);
	time = ((toc.tv_sec - tic.tv_sec) * 1000.0 + (toc.tv_usec - tic.tv_usec) * 0.001) / 1000.0;
	Acc = opf_Accuracy(gTrain); if(errorOccurred) return;
	fprintf(stdout, "\nFinal opf_Accuracy in the training set: %.2f%%", Acc * 100);
	
	Acc = opf_Accuracy(gEval); if(errorOccurred) return;
	fprintf(stdout, "\nFinal opf_Accuracy in the evaluation set: %.2f%%", Acc * 100);
	

	fprintf(stdout, "\n\nWriting classifier's model file ...");
	
	//sprintf(fileName, "%s.classifier.opf", argv[1]);
	opf_WriteModelFile(gTrain, "classifier.opf");
	fprintf(stdout, " OK");
	

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