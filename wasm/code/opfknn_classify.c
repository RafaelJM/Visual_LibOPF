#include "OPF.h"
#include <emscripten.h>


EMSCRIPTEN_KEEPALIVE
void c_opfknn_classify(int *argc, char **argv)
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
		fprintf(stderr, "\nusage opfknn_classify <P1> <P2>");
		fprintf(stderr, "\nP1: test set in the OPF file format");
		fprintf(stderr, "\nP2: precomputed distance file (leave it in blank if you are not using this resource\n");
		return;
	}

	int n, i;
	float time;
	char fileName[256];
	FILE *f = NULL;
	timer tic, toc;

	if (*argc == 3)
		opf_PrecomputedDistance = 1;
	fprintf(stdout, "\nReading data files ...");
	
	sprintf(fileName, "%s.classifier.opf", argv[1]);
	Subgraph *gTest = ReadSubgraph(argv[1]), *gTrain = opf_ReadModelFile(fileName); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	if (opf_PrecomputedDistance){
		opf_DistanceValue = opf_ReadDistances(argv[2], &n); if(errorOccurred) return;
	}

	fprintf(stdout, "\nClassifying test set ...");
	
	gettimeofday(&tic, NULL);
	opf_OPFknnClassify(gTrain, gTest); if(errorOccurred) return;
	gettimeofday(&toc, NULL);
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nWriting output file ...");
	
	sprintf(fileName, "%s.out", argv[1]);
	opf_WriteOutputFile(gTest, fileName);
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nDeallocating memory ...");
	DestroySubgraph(&gTrain);
	DestroySubgraph(&gTest);
	if (opf_PrecomputedDistance)
	{
		for (i = 0; i < n; i++)
			free(opf_DistanceValue[i]);
		free(opf_DistanceValue);
	}
	fprintf(stdout, " OK\n");

	time = ((toc.tv_sec - tic.tv_sec) * 1000.0 + (toc.tv_usec - tic.tv_usec) * 0.001) / 1000.0;
	fprintf(stdout, "\nTesting time: %f seconds\n", time);
	

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