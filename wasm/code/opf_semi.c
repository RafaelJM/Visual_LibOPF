#include "OPF.h"
#include <emscripten.h>


EMSCRIPTEN_KEEPALIVE
void c_opf_semi(int *argc, char **argv)
{
	EM_ASM(
        FS.syncfs(true, function (err) {
            // Error
        });
    );

  errorOccurred = 0;  
  opf_PrecomputedDistance = 0;
  if ((*argc != 5) && (*argc != 4) && (*argc != 3) && (*argc != 2))
  {
    fprintf(stderr, "\nusage opf_semi_train <P1> <P2>");
    fprintf(stderr, "\nP1: Labeled training set in the OPF file format");
    fprintf(stderr, "\nP2: Unlabeled training set in the OPF file format");
    fprintf(stderr, "\nP3: Evaluation set in the OPF file format");
    fprintf(stderr, "\nP4: Precomputed distance file (leave it in blank if you are not using this resource)\n");
    return;
  }

  int n, i;
  int opf_ComputeEvaluation = 0;
  char fileName[256];
  FILE *f = NULL;
  timer tic, toc;
  float time;
  Subgraph *geval = NULL;

  if (*argc == 4)
    opf_ComputeEvaluation = 1;

  if (*argc == 5)
    opf_PrecomputedDistance = 1;

  fprintf(stdout, "\nReading labeled data file...");
  
  Subgraph *g = ReadSubgraph(argv[1]); if(errorOccurred) return;
  fprintf(stdout, " OK");
  

  fprintf(stdout, "\nReading unlabeled data file...");
  
  Subgraph *gunl = ReadSubgraph(argv[2]); if(errorOccurred) return;
  fprintf(stdout, " OK");
  

  if (opf_ComputeEvaluation)
  {
    fprintf(stdout, "\nReading evaluation data file...");
    
    geval = ReadSubgraph(argv[3]); if(errorOccurred) return;
    fprintf(stdout, " OK");
    
  }

  if (opf_PrecomputedDistance){
    opf_DistanceValue = opf_ReadDistances(argv[4], &n); if(errorOccurred) return;
  }

  fprintf(stdout, "\nTraining Semi OPF classifier ...");
  
  gettimeofday(&tic, NULL);
  Subgraph *s = opf_OPFSemiLearning(g, gunl, geval); if(errorOccurred) return;
  opf_OPFTraining(s); if(errorOccurred) return;
  gettimeofday(&toc, NULL);
  fprintf(stdout, " OK");
  

  fprintf(stdout, "\nWriting classifier's model file ...");
  
  sprintf(fileName, "%s.cla", argv[1]);
  opf_WriteModelFile(g, fileName);
  fprintf(stdout, " OK");
  

  fprintf(stdout, "\nWriting output file ...");
  

  sprintf(fileName, "%s.out", argv[1]);
  opf_WriteOutputFile(s, fileName);
  fprintf(stdout, " OK");
  

  fprintf(stdout, "\nDeallocating memory ...");
  
  DestroySubgraph(&s);
  if (opf_PrecomputedDistance)
  {
    for (i = 0; i < n; i++)
      free(opf_DistanceValue[i]);
    free(opf_DistanceValue);
  }
  fprintf(stdout, " OK\n");

  time = ((toc.tv_sec - tic.tv_sec) * 1000.0 + (toc.tv_usec - tic.tv_usec) * 0.001) / 1000.0;
  fprintf(stdout, "\nExecution time: %f seconds\n", time);
  

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