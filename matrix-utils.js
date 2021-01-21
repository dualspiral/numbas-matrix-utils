// MIT License
//
// Copyright (c) 2021 Dr Daniel Naylor
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
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