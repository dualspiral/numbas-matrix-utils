Numbas.addExtension('matrix-utils',['jme'],function(extension) {
    let scope = extension.scope;
    let TList = Numbas.jme.types.TList;
    let TMatrix = Numbas.jme.types.TMatrix;
    let funcObj = Numbas.jme.funcObj;
  
    let fill_diag = function(matrix, values, offsets) {
      if (values.length !== offsets.length) {
        throw new Numbas.Error("Values and offsets must be the same size");
      }
  
      let rows = matrix.length;
      if (rows === 0) {
        return matrix;
      }
      let cols = matrix[0].length;
      for (let idx = 0; idx < values.length; ++idx) {
        let offset = offsets[idx];
        let r = 0;
        let c = 0;
        if (offset < 0) {
          c = -offset;
        } else if (offset > 0) {
          r = offset
        }
        let v = values[0];
  
        while (r < rows && c < cols) {
          matrix[r][c] = v;
          ++r;
          ++c;
        }
      }
  
      return new TMatrix(matrix);
    }
    
    
    scope.addFunction(new funcObj('fill_diag', [TMatrix,TList,TList], TMatrix, fill_diag, {unwrapValues:true}));
  });