export default class FileManager{
  constructor(parent,stateUpdate) {
    this.parent = parent;
    this.stateUpdate = stateUpdate;
    
    this.Module = require('./libopf.js')(); // Your Emscripten JS output file
    this.Module['FM'] = this;
    
    this.FS = this.Module.FS;
    this.isDv={dat:"",cla:"",dis:""}
    this.outInfo = {
      dat: (dv, data, title, description, graphOrigin) => {return(this.readSubGraph(dv, data, title, description, graphOrigin))},
      cla: (dv, data, title, description) => {return(this.readModelFile(dv, data, title, description))},
      dis: (dv, data, title, description, graph) => {return(this.readDistances(dv, data, title, description, graph))},
      //-----
      out: (file, data, title, description, subGraph, modelFileClassificator,extraInfo) => {return(this.readClassification(file, data, title, description, subGraph, modelFileClassificator,extraInfo))},
      acc: (file) => {return(this.FS.readFile(file,{encoding: 'utf8'}).split("\n"))},//this.readAccuracy(file))},
      pra: (file) => {return({pruningRate: this.FS.readFile(file,{encoding: 'utf8'}).split("\n")[0]})},
      pre: (file) => {return({predList: this.FS.readFile(file,{encoding: 'utf8'}).split("\n")})},
      tim: (file) => {return({time:this.FS.readFile(file,{encoding: 'utf8'}).split("\n")[0]})},
    }
    this.cont = [0,0,0,0]
    this.getName ={
      dat: (file) => {return(file.substring(7).replace(".dat",""))},//+" "+(this.cont[0]))},
      cla: () => {return("ModelFile "+(this.cont[1]+=1))},
      dis: () => {return("Distances "+(this.cont[2]+=1))},
      out: () => {return("Classification "+(this.cont[3]+=1))},
      acc: () => {},
      pra: () => {},
      pre: () => {},
      tim: () => {}
    }
  }

/*
  quick_Sort(origArray) {
    if (origArray.length <= 1) { 
      return origArray;
    } else {
  
      var left = [];
      var right = [];
      var newArray = [];
      var pivot = origArray.pop();
      var length = origArray.length;
  
      for (var i = 0; i < length; i++) {
        if (origArray[i].id <= pivot.id) {
          left.push(origArray[i]);
        } else {
          right.push(origArray[i]);
        }
      }
  
      return newArray.concat(this.quick_Sort(left), pivot, this.quick_Sort(right));
    }
  }
*/
  getFunctionParamters(functionInfo){
    var cVariables = [""]
    var infoVariables = [];
    var fileUsed = -1;
    for (var i = 0; i < functionInfo.objs.length; i++) {
      if(functionInfo.objs[i].hasOwnProperty("saveInFile")){
        this[functionInfo.objs[i].saveInFile](functionInfo.objs[i],"files/"+(fileUsed=fileUsed+1)+".temp")
        cVariables = cVariables.concat("files/"+fileUsed+".temp");
        infoVariables = infoVariables.concat(functionInfo.objs[i].title)
      }
      else
        if(functionInfo.objs[i].value.toString() !== ""){
          cVariables = cVariables.concat(functionInfo.objs[i].value.toString());
          infoVariables = infoVariables.concat(functionInfo.objs[i].hasOwnProperty("title") ? functionInfo.objs[i].title : functionInfo.objs[i].value.toString())
        }
    }
    return({cVariables, infoVariables})
  }

  runCFunction(functionInfo){//,graphOrigin = null, modelFileOrigin = null){
    const cwrap = this.Module.cwrap("c_"+functionInfo.opfFunction.function,null,['number', 'number']);
    
    var variables = this.getFunctionParamters(functionInfo)

    var ptrArr = this.Module._malloc(variables.length * 4);
    var ptrAux = []
    for (var i = 0; i < variables.cVariables.length; i++) {
      var len = variables.cVariables[i].length + 1;
      var ptr = this.Module._malloc(len);
      ptrAux = ptrAux.concat(ptr);
      this.Module.stringToUTF8(variables.cVariables[i].toString(), ptr, len);

      this.Module.setValue(ptrArr + i * 4, ptr, "i32");      
    }
    var ptrNum = this.Module._malloc(4);
    this.Module.setValue(ptrNum, variables.cVariables.length, 'i32');


    this.parent.addText("Runing: "+functionInfo.opfFunction.function + "(" + variables.infoVariables.toString() + ")","textFunction-info")
    cwrap(ptrNum,ptrArr); //testar, will wait?
  }

  readCOutFiles(functionInfo, description, data){
    var buffer = {dat: [],cla: [],dis: [],out: [], acc:[]}

    if(!this.FS.readdir("files/").find(e => e.length > 6)){
      this.parent.addText("Error! Dont have files to read","textErr")
      return(buffer);
    }

    if(functionInfo.opfFunction.function === "opf_merge" || functionInfo.opfFunction.function === "opf_normalize"){
      var file = this.FS.readdir("files/").find(e => e.substr(-3) === "dat");
      if(file){
        var loadedFile = this.readGraph(new DataView(this.FS.readFile("files/"+file, null).buffer),data,"Graph Data",description);                    
        this.parent.Tree.current.addNewEmptyData(loadedFile,(functionInfo.opfFunction.function === "opf_normalize"? "Normalized Data" : "Marged data"));
        this.parent.OPFFunctions.current.loadFunctions()
        this.FS.unlink("files/"+file);
      }
      return(buffer);
    }

    this.parent.addText("Successfully finished the opf function","textFunction-info")

    var graphOrigin = functionInfo.objs.find(e => e.isGraph || e.isSubGraph)
    var modelFileOrigin = functionInfo.objs.find(e => e.isModelFile)
    
    var extraInfo = {}
    functionInfo.opfFunction.extraOutInfo.map((out, index) => {
      var dir = this.FS.readdir("files/");
      var file = dir.find(e => e.substr(-3) === out)
      if(file){
        extraInfo = Object.assign({}, extraInfo, this.outInfo[out]((this.isDv.hasOwnProperty(out)?new DataView(this.FS.readFile("files/"+file, null).buffer):"files/"+file),data,this.getName[out](file),description,graphOrigin,modelFileOrigin))
        this.FS.unlink("files/"+file);
      }
      return(null);
    })

    functionInfo.opfFunction.out.map((out, index) => {
      var dir = this.FS.readdir("files/");
      var file = dir.find(e => e.substr(-3) === out)
      if(file){
        var obj = this.outInfo[out]((this.isDv.hasOwnProperty(out)?new DataView(this.FS.readFile("files/"+file, null).buffer):"files/"+file),data,this.getName[out](file),description,graphOrigin,modelFileOrigin,extraInfo)
        if(obj)
          buffer[out][buffer[out].length] =  Object.assign({}, extraInfo, obj)
        this.FS.unlink("files/"+file);
      }
      return(null);
    })

    if(this.FS.readdir("files/").find(e => e.length > 6)) 
      this.parent.addText("Warning! Still have some files","textWar")

    this.parent.OPFFunctions.current.loadFunctions();
    return(buffer);
  }

  cloneToNewGraph(obj, convertToSubGraphNode = false){ //arrumar
    var newData= {
      nlabels: (obj.nlabels?obj.nlabels:obj.graphOrigin.nlabels), nfeats: (obj.nlabels?obj.nfeats:obj.graphOrigin.nfeats), title: "Clone of "+obj.title, description:obj.description, 
      open: false, isGraph: true, positionDuplicate: [],
      nodes: [],
      edges:[]
    };
    newData.getDetails = "detailsGraph"
    newData.saveInFile = "writeGraph"

    newData.nodes = this.cloneNodes(newData,obj,convertToSubGraphNode)

    newData.data = newData;

    return(newData);
  }

  cloneNodes(newData, obj, convertToSubGraphNode = false){ //arrumar
    var nodes = []
    if(convertToSubGraphNode){
      for(var i = 0; i < obj.nodes.length; i++){
        nodes[i] = {
        graph: newData,
        feat: [],
        id: obj.nodes[i].id,//position
        truelabel: obj.nodes[i].truelabel,
        size:obj.nodes[i].size, title:obj.nodes[i].title, label:obj.nodes[i].label, self:null};
        for(var j = 0; j < obj.nfeats; j++){
          nodes[i].feat[j] = obj.nodes[i].feat[j];
        }

        nodes[i].self = nodes[i];
        nodes[i].getDetails = "detailsGraphNode"
      }
    } else {
      for(i in obj.nodes){
        var node = Object.assign({}, obj.nodes[i])
        node.graph = newData
        node.self = node
        nodes = nodes.concat(node)
      }
    }
    return(nodes)
  }

  readGraph(dv, data, title, description){
    if(data && !data.hasOwnProperty("SubGraphs"))this.parent.addText("Error Data","textErr")
    var graph= {
      nlabels: -1, nfeats: -1, title: title, description:description, open: false, isGraph: true, positionDuplicate: [], data,
      nodes: [],
      edges:[]
    };
    graph.getDetails = "detailsGraph"
    graph.saveInFile = "writeGraph"

    var cont = 0;
    var nnodes = dv.getInt32(cont,true);
    graph.nlabels = dv.getInt32(cont=cont+4,true);
    graph.nfeats = dv.getInt32(cont=cont+4,true);

    if(nnodes < 0 || graph.nlabels < 0 || graph.nfeats < 0 || (3 + nnodes*(2+graph.nfeats))*4 !== dv.byteLength){
      this.parent.addText("Error in the graph/data reading","textErr")
      return;
    }

    for(var i = 0; i < nnodes; i++){
      graph.nodes[i] = {
      graph: graph,
      feat: [  ],
      id: dv.getInt32(cont=cont+4,true),//position
      truelabel: dv.getInt32(cont=cont+4,true),
      x:0, y:0, size:0.5, title:"", label:"", self:null};
      for(var j = 0; j < graph.nfeats; j++){
        graph.nodes[i].feat[j] = dv.getFloat32(cont=cont+4,true);
      }

      let id = graph.nodes[i].id;
      if(graph.nodes.slice(0,-1).find(e => e.id === id)){
        graph.positionDuplicate.push(i)
        graph.nodes[i].id = Math.max.apply(Math, graph.nodes.map(function(o) { return o.id; }))+1
      }

      graph.nodes[i].title = "Node "+graph.nodes[i].id.toString();
      graph.nodes[i].label = graph.nodes[i].title;
      graph.nodes[i].self = graph.nodes[i];
      graph.nodes[i].getDetails = "detailsGraphNode"
    }
    
    if(graph.positionDuplicate.length){
      this.parent.addText("Warning! Some nodes had same position (ID), so new positions were given to them","textWar")
    }
    return(graph);
  }

  writeGraph(graph, file){
    const buf = Buffer.allocUnsafe((3 + graph.nodes.length*(2+graph.nfeats))*4);
    
    var cont = 0;
    buf.writeInt32LE(graph.nodes.length,cont);
    buf.writeInt32LE(graph.nlabels,cont=cont+4);
    buf.writeInt32LE(graph.nfeats,cont=cont+4);
    for(var i = 0; i < graph.nodes.length; i++){
      buf.writeInt32LE(graph.nodes[i].id,cont=cont+4);
      buf.writeInt32LE(graph.nodes[i].truelabel,cont=cont+4);
      for(var j = 0; j < graph.nfeats; j++){
        buf.writeFloatLE(graph.nodes[i].feat[j],cont=cont+4);
      }
    }
    this.FS.writeFile(file,Buffer.from(buf));
  }
  
  readSubGraph(dv, data, title, description, graphOrigin){
    if(data && !data.hasOwnProperty("SubGraphs"))this.parent.addText("Error Data","textErr")
    var subGraph = {title: title, description:description, nodes:[], edges:[], graphOrigin:graphOrigin, isSubGraph: true, data}
    var cont = 0;
    subGraph.getDetails = "detailsGraph"
    subGraph.saveInFile = "writeSubGraph"

    var nnodes = dv.getInt32(cont,true);
    var nlabels = dv.getInt32(cont=cont+4,true);
    var nfeats = dv.getInt32(cont=cont+4,true);
    if(nnodes < 0 || nlabels < 0 || nfeats < 0 || (3 + nnodes*(2+nfeats))*4 !== dv.byteLength){
      this.parent.addText("Error in the graph/data reading","textErr")
      return;
    }

    for(var i = 0; i < nnodes; i++){
      let id = dv.getInt32(cont=cont+4,true);
      var node = this.parent.Tree.current.state.activeData.graph.nodes.find(element => element.id === id);
      if(node !== undefined)
        subGraph.nodes.push(node)
      cont += 4 + nfeats * 4
    }
    return(subGraph)
  }

  createSubGraphByIndex(indexes, title, description, graphOrigin){
    var subGraph = {title: title, description:description, nodes:[], edges:[], graphOrigin:graphOrigin, isSubGraph: true, data: graphOrigin.data}
    subGraph.getDetails = "detailsGraph"
    subGraph.saveInFile = "writeSubGraph"

    var nnodes = indexes.length;
    var nlabels = graphOrigin.nlabels;
    var nfeats = graphOrigin.nfeats;
    if(nnodes < 0 || nlabels < 0 || nfeats < 0){
      this.parent.addText("Error in the graph/data create","textErr")
      return;
    }

    for(var i in indexes){
      var node = graphOrigin.nodes[indexes[i]];
      if(node !== undefined)
        subGraph.nodes.push(node)
    }
    return(subGraph)
  }
  
  writeSubGraph(graph, file){
    const buf = Buffer.allocUnsafe((3 + graph.nodes.length*(2+graph.graphOrigin.nfeats))*4);
    
    var cont = 0;
    buf.writeInt32LE(graph.nodes.length,cont);
    buf.writeInt32LE(graph.graphOrigin.nlabels,cont=cont+4);
    buf.writeInt32LE(graph.graphOrigin.nfeats,cont=cont+4);
    for(var i = 0; i < graph.nodes.length; i++){
      buf.writeInt32LE(graph.nodes[i].id,cont=cont+4);
      buf.writeInt32LE(graph.nodes[i].truelabel,cont=cont+4);
      for(var j = 0; j < graph.graphOrigin.nfeats; j++){
        buf.writeFloatLE(graph.nodes[i].feat[j],cont=cont+4);
      }
    }
    this.FS.writeFile(file,Buffer.from(buf));
  }

  readModelFile(dv, data, title, description){
    if(data && !data.hasOwnProperty("SubGraphs"))this.parent.addText("Error Data","textErr")
    var modelFile= {
      nlabels: -1, nfeats: -1, df: -1, bestk: -1, K: -1, mindens: -1, maxdens: -1, title: title, open: false, description:description, ordered_list_of_nodes: [], isModelFile: true, data,
      positionDuplicate: [], nodes: [], edges:[]
    };

    modelFile.getDetails = "detailsModelFile"
    modelFile.saveInFile = "writeModelFile"
    
    var cont = 0;
    var nnodes = dv.getInt32(cont,true);
    modelFile.nlabels = dv.getInt32(cont=cont+4,true);
    modelFile.nfeats = dv.getInt32(cont=cont+4,true);
    modelFile.df = dv.getFloat32(cont=cont+4,true);
    modelFile.bestk = dv.getInt32(cont=cont+4,true);
    modelFile.K = dv.getFloat32(cont=cont+4,true);
    modelFile.mindens = dv.getFloat32(cont=cont+4,true);
    modelFile.maxdens = dv.getFloat32(cont=cont+4,true);
    
    if(nnodes < 0 || modelFile.nlabels < 0 || modelFile.nfeats < 0 || (8 + nnodes*(7+modelFile.nfeats+1))*4 !== dv.byteLength){
      this.parent.addText("Error in the graph/data reading","textErr")
      return;
    }

    for(var i = 0; i < nnodes; i++){
      modelFile.nodes[i] = {
      feat: [  ],
      id: dv.getInt32(cont=cont+4,true),
      truelabel: dv.getInt32(cont=cont+4,true),
      pred: dv.getInt32(cont=cont+4,true),
      nodelabel: dv.getInt32(cont=cont+4,true),
      pathval: dv.getFloat32(cont=cont+4,true),
      radius: dv.getFloat32(cont=cont+4,true),
      dens: dv.getFloat32(cont=cont+4,true),
      x:0, y:0, size:0.5, title:"", label:"", self:null}; //nodelabel === LABEL FROM OPF
      for(var j = 0; j < modelFile.nfeats; j++){
        modelFile.nodes[i].feat[j] = dv.getFloat32(cont=cont+4,true);
      }

      let id = modelFile.nodes[i].id;
      if(modelFile.nodes.slice(0,-1).find(e => e.id === id)){
        modelFile.positionDuplicate.push(i)
        modelFile.nodes[i].id = Math.max.apply(Math, modelFile.nodes.map(function(o) { return o.id; }))+1
      }

      modelFile.nodes[i].title = "Node "+modelFile.nodes[i].id.toString();
      modelFile.nodes[i].label = modelFile.nodes[i].title;
      modelFile.nodes[i].self = modelFile.nodes[i];
      modelFile.nodes[i].modelFile = modelFile
      modelFile.nodes[i].getDetails = "detailsModelFileNode"
    }
    for(i = 0; i < nnodes; i++){
      modelFile.ordered_list_of_nodes[i] = dv.getInt32(cont=cont+4,true);
    }

    for(var ID in modelFile.ordered_list_of_nodes){
      if(modelFile.nodes[ID].pred !== -1){
        modelFile.edges = modelFile.edges.concat({
          id: modelFile.edges.length,
          source: modelFile.nodes[ID].id,
          target: modelFile.nodes[modelFile.nodes[ID].pred].id,
        })
      }
    }

    if((8 + nnodes*(7+modelFile.nfeats)+ modelFile.ordered_list_of_nodes.length)*4 !== dv.byteLength){
      this.parent.addText("Error in the graph/data reading","textErr")
      return;
    }

    if(modelFile.positionDuplicate.length){
      this.parent.addText("Warning! Some nodes had same position (ID), so new positions were given to them","textWar")
    }

    return(modelFile);
  }

  writeModelFile(modelFile, file){
    const buf = Buffer.allocUnsafe((8 + modelFile.nodes.length*(7+modelFile.nfeats) + modelFile.ordered_list_of_nodes.length)*4);
    
    var cont = 0;
    buf.writeInt32LE(modelFile.nodes.length,cont);
    buf.writeInt32LE(modelFile.nlabels,cont=cont+4);
    buf.writeInt32LE(modelFile.nfeats,cont=cont+4);
    buf.writeFloatLE(modelFile.df,cont=cont+4);
    buf.writeInt32LE(modelFile.bestk,cont=cont+4);
    buf.writeFloatLE(modelFile.K,cont=cont+4);
    buf.writeFloatLE(modelFile.mindens,cont=cont+4);
    buf.writeFloatLE(modelFile.maxdens,cont=cont+4);
    for(var i = 0; i < modelFile.nodes.length; i++){
      buf.writeInt32LE(modelFile.nodes[i].id,cont=cont+4);
      buf.writeInt32LE(modelFile.nodes[i].truelabel,cont=cont+4);
      buf.writeInt32LE(modelFile.nodes[i].pred,cont=cont+4);
      buf.writeInt32LE(modelFile.nodes[i].nodelabel,cont=cont+4);
      buf.writeFloatLE(modelFile.nodes[i].pathval,cont=cont+4);
      buf.writeFloatLE(modelFile.nodes[i].radius,cont=cont+4);
      buf.writeFloatLE(modelFile.nodes[i].dens,cont=cont+4);
      for(var j = 0; j < modelFile.nfeats; j++){
        buf.writeFloatLE(modelFile.nodes[i].feat[j],cont=cont+4);
      }
    }
    for(i = 0; i < modelFile.nodes.length; i++){
      buf.writeInt32LE(modelFile.ordered_list_of_nodes[i],cont=cont+4);
    }
    this.FS.writeFile(file,Buffer.from(buf));
  }

  readClassification(file, data, title, description, subGraph, modelFileClassificator,extraInfo){ //Arrumar: Test if is necessary to link node ids
    if(data && !data.hasOwnProperty("SubGraphs"))this.parent.addText("Error Data","textErr")
    if(extraInfo){
      var classification = {isClassification: true, classification: this.FS.readFile(file,{encoding: 'utf8'}).split("\n"), title: title, description:description, subGraph: subGraph, modelFileClassificator: modelFileClassificator, data}
      classification.getDetails = "detailsClassification"
      classification.saveInFile = "writeClassification"
      classification.nodes = this.cloneNodes(classification,subGraph) 
      classification.edges = []

      for(var i in classification.nodes){
        let id = classification.nodes[i].id;
        if(modelFileClassificator.nodes.find(e => e.id === id)){
          if (window.confirm("Error! Same position (ID) in ModelFile node and SubGraph/Graph node, need to change all position (ID) JUST in this function operation, ok?" )) {
            let cont = Math.max.apply(Math, modelFileClassificator.nodes.map(function(o) { return o.id; }))+1;
            classification.nodes.forEach(e => {e.id = cont=cont+1})
            break;
          }
          else{
            return;
          }
        }
      }

      for(i = 0; i < extraInfo.predList.length-1; i++){
        if(extraInfo.predList[i] !== -1){
          classification.edges.push({
            id: classification.edges.length + modelFileClassificator.edges.length,
            source: classification.nodes[i].id,
            target: modelFileClassificator.nodes[extraInfo.predList[i]].id,
          })
        }
      }
      classification.edges = classification.edges.concat(classification.modelFileClassificator.edges)
      classification.nodes = classification.nodes.concat(this.cloneNodes(classification,modelFileClassificator))
      return(classification)
    }
    else
      return({classification: this.FS.readFile(file,{encoding: 'utf8'}).split("\n")})
  }

  writeClassification(classification, file){
    var aux = ""
    classification.classification.map((classification, index) => {
      aux = aux.concat(classification.toString()+"\n");
      return -1;
    });
    this.FS.writeFile(file,aux,{encoding: 'utf8'});
  }

  readDistances(dv, data, title, description, graph){ //Arrumar: Test if is necessary to link node ids
    if(data && !data.hasOwnProperty("SubGraphs")) this.parent.addText("Error Data","textErr")
    var cont = 0;
    var nsamples = dv.getInt32(cont,true);
    var distances = new Array(nsamples);
    for(var i=0; i<nsamples; i++) {
      distances[i] = new Array(nsamples);
      for(var j=0; j<nsamples; j++) {
        distances[i][j] = dv.getFloat32(cont=cont+4,true);
      }
    }
    var dists = {isDistances: true, distances: distances, title: title, description:description, graph:graph, data:data}

    dists.getDetails = "detailsDistances"
    dists.saveInFile = "writeDistances"
    dists.nodes = dists.graph.nodes

    console.log(dists)
    return(dists)
  }

  writeDistances(dis, file){
    console.log((1 + (Math.pow(dis.distances[0].length, 2)))*4)
    const buf = Buffer.allocUnsafe((1 + (Math.pow(dis.distances[0].length, 2)))*4);
    var cont = 0;
    buf.writeInt32LE(dis.distances.length,cont);
    for(var i=0; i<dis.distances[0].length; i++) {
      for(var j=0; j<dis.distances[0].length; j++) {
        buf.writeFloatLE(dis.distances[i][j],cont=cont+4);
      }
    }
    this.FS.writeFile(file,Buffer.from(buf));
  }
}