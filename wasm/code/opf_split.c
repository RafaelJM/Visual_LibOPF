#include "OPF.h"
#include <stdio.h>
#include <emscripten.h>

void CheckInputData(float TrPercentage, float EvalPercentage, float TestPercentage)
{
	fprintf(stdout, "\nSummation of set percentages = %.1f ...", TrPercentage + EvalPercentage + TestPercentage);
	if ((float)(TrPercentage + EvalPercentage + TestPercentage) != (float)1.0){
		Error("Percentage summation is not equal to 1", "CheckInputData"); return;
	}
	fprintf(stdout, " OK");

	fprintf(stdout, "\nChecking set percentages ...");
	if (TrPercentage == 0.0f || TestPercentage == 0.0f){
		Error("Percentage of either training set or test set is equal to 0", "CheckInputData"); return;
	}
	fprintf(stdout, " OK");
}

EMSCRIPTEN_KEEPALIVE
void c_opf_split(int *argc, char **argv)
{
	EM_ASM(
        FS.syncfs(true, function (err) {
            // Error
        });
    );
	
	errorOccurred = 0;	

	if (*argc != 6)
	{
		fprintf(stderr, "\nusage opf_split <P1> <P2> <P3> <P4> <P5>");
		fprintf(stderr, "\nP1: input dataset in the OPF file format");
		fprintf(stderr, "\nP2: percentage for the training set size [0,1]");
		fprintf(stderr, "\nP3: percentage for the evaluation set size [0,1] (leave 0 in the case of no learning)");
		fprintf(stderr, "\nP4: percentage for the test set size [0,1]");
		fprintf(stderr, "\nP5: normalize features? 1 - Yes  0 - No\n\n");
		return;
	}
	Subgraph *g = NULL, *gAux = NULL, *gTraining = NULL, *gEvaluating = NULL, *gTesting = NULL;
	float training_p = atof(argv[2]), evaluating_p = atof(argv[3]), testing_p = atof(argv[4]);
	int normalize = atoi(argv[5]);
	char fileName[256];

	CheckInputData(training_p, evaluating_p, testing_p); if(errorOccurred) return;

	fprintf(stdout, "\nReading data set ...");
	
	g = ReadSubgraph(argv[1]); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	if (normalize){
		opf_NormalizeFeatures(g); if(errorOccurred) return;
	}

	fprintf(stdout, "\nSplitting data set ...");
	
	opf_SplitSubgraph(g, &gAux, &gTesting, training_p + evaluating_p); if(errorOccurred) return;

	if (evaluating_p > 0){
		opf_SplitSubgraph(gAux, &gTraining, &gEvaluating, training_p / (training_p + evaluating_p)); if(errorOccurred) return;
	}
	else{
		gTraining = CopySubgraph(gAux); if(errorOccurred) return;
	}

	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nWriting data sets to disk ...");
	
	sprintf(fileName, "%s.training.dat", argv[1]);
	WriteSubgraph(gTraining, fileName); if(errorOccurred) return;
	if (evaluating_p > 0){
		sprintf(fileName, "%s.evaluating.dat", argv[1]);
		WriteSubgraph(gEvaluating, fileName); if(errorOccurred) return;
	}
	sprintf(fileName, "%s.testing.dat", argv[1]);
	WriteSubgraph(gTesting, fileName); if(errorOccurred) return;
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nDeallocating memory ...");
	DestroySubgraph(&g);
	DestroySubgraph(&gAux);
	DestroySubgraph(&gTraining);
	DestroySubgraph(&gEvaluating);
	DestroySubgraph(&gTesting);
	fprintf(stdout, " OK\n");
	
	EM_ASM(
        FS.syncfs(function (err) {
            // Error
        });
    );
}