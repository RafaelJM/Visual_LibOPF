#include "OPF.h"
#include <emscripten.h>


EMSCRIPTEN_KEEPALIVE
void c_opf_cluster(int *argc, char **argv)
{
	EM_ASM(
        FS.syncfs(true, function (err) {
            // Error
        });
    );
	
	errorOccurred = 0;
	opf_PrecomputedDistance = 0;
	int i, n, op, p;
	float value;
	char fileName[256];

	if ((*argc != 6) && (*argc != 5))
	{
		fprintf(stderr, "\nusage opf_cluster <P1> <P2> <P3> <P4> <P5>");
		fprintf(stderr, "\nP1: unlabeled data set in the OPF file format");
		fprintf(stderr, "\nP2: kmax(maximum degree for the knn graph)");
		fprintf(stderr, "\nP3: P3 0 (height), 1(area) and 2(volume)");
		fprintf(stderr, "\nP4: value of parameter P3 in (0-1)");
		fprintf(stderr, "\nP5: precomputed distance file (leave it in blank if you are not using this resource");
		return;
	}

	if (*argc == 6)
		opf_PrecomputedDistance = 1;
	fprintf(stdout, "\nReading data file ...");
	Subgraph *g = ReadSubgraph(argv[1]); if(errorOccurred) return;

	if (opf_PrecomputedDistance){
		opf_DistanceValue = opf_ReadDistances(argv[5], &n); if(errorOccurred) return;
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

	op = atoi(argv[3]);

	opf_BestkMinCut(g, 1, atoi(argv[2])); if(errorOccurred) return; //default kmin = 1

	value = atof(argv[4]);
	if ((value < 1) && (value > 0))
	{
		fprintf(stdout, "\n\n Filtering clusters ... ");
		switch (op)
		{
		case 0:
			fprintf(stdout, "\n by dome height ... ");
			float Hmax = 0;
			for (i = 0; i < g->nnodes; i++)
				if (g->node[i].dens > Hmax)
					Hmax = g->node[i].dens;
			opf_ElimMaxBelowH(g, value * Hmax);
			break;
		case 1:
			fprintf(stdout, "\n by area ... ");
			opf_ElimMaxBelowArea(g, (int)(value * g->nnodes)); if(errorOccurred) return;
			break;
		case 2:
			fprintf(stdout, "\n by volume ... ");
			double Vmax = 0;
			for (i = 0; i < g->nnodes; i++)
				Vmax += g->node[i].dens;
			opf_ElimMaxBelowVolume(g, (int)(value * Vmax / g->nnodes)); if(errorOccurred) return;
			break;
		default:
			fprintf(stderr, "\nInvalid option for parameter P3 ... ");
			return;
			break;
		}
	}

	fprintf(stdout, "\n\nClustering by OPF ");
	opf_OPFClustering(g); if(errorOccurred) return;
	fprintf(stdout, "num of clusters %d\n", g->nlabels);

	/* If the training set has true labels, then create a
	   classifier by propagating the true label of each root to
	   the nodes of its tree (cluster). This classifier can be
	   evaluated by running opf_knn_classify on the training set
	   or on unseen testing set. Otherwise, copy the cluster
	   labels to the true label of the training set and write a
	   classifier, which essentially can propagate the cluster
	   labels to new nodes in a testing set. */

	/*if (g->node[0].truelabel!=0){ // labeled training set
	  g->nlabels = 0;
	  for (i = 0; i < g->nnodes; i++){//propagating root labels
	    if (g->node[i].root==i)
	      g->node[i].label = g->node[i].truelabel;
	    else
	      g->node[i].label = g->node[g->node[i].root].truelabel;
	  }

	  for (i = 0; i < g->nnodes; i++){
		  // retrieve the original number of true labels
		  if (g->node[i].label > g->nlabels)
			  g->nlabels = g->node[i].label;
	  }
	}else{ // unlabeled training set
	  for (i = 0; i < g->nnodes; i++)
	    g->node[i].truelabel = g->node[i].label+1;
	}*/

	fprintf(stdout, "\nWriting classifier's model file ...");
	
	sprintf(fileName, "%s.cla", argv[1]);
	opf_WriteModelFile(g, fileName);
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\nWriting output file ...");
	
	sprintf(fileName, "%s.out", argv[1]);
	opf_WriteOutputFile(g, fileName);
	fprintf(stdout, " OK");
	

	fprintf(stdout, "\n\nDeallocating memory ...\n");
	DestroySubgraph(&g);
	if (opf_PrecomputedDistance)
	{
		for (i = 0; i < n; i++)
			free(opf_DistanceValue[i]);
		free(opf_DistanceValue);
	}
	
	EM_ASM(
        FS.syncfs(function (err) {
            // Error
        });
    );
}