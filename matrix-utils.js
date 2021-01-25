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
    let TNum = Numbas.jme.types.TNum;
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
        let v = values[idx];
  
        while (r < rows && c < cols) {
          matrix[r][c] = v;
          ++r;
          ++c;
        }
      }
  
      return new TMatrix(matrix);
    };

    let create_diag = function(rows, cols, values, offsets) {
        if (rows <= 0 || cols <= 0 || !Number.isInteger(rows) || !Number.isInteger(cols)) {
            throw new Numbas.Error("There must be a postive integer for both rows and cols");
        }

        let main_array = new Array(rows);
        for (let idx = 0; idx < rows; ++idx) {
            let inner_array = new Array(cols);
            for (let j = 0; j < rows; ++j) {
                inner_array[j] = 0;
            }
            main_array[idx] = inner_array;
        }

        // This is somewhat hacky, and relies on NUMBAS internal behaviour by the looks of it...
        main_array.rows = rows;
        main_array.columns = cols;

        return fill_diag(main_array, values, offsets);
    };

    let subsample_matrix = function(matrix, ignoredColIndex) {
        let ret = [];
        for (let i = 1; i < matrix.length; ++i) {
            let row = [];
            for (let j = 0; j < matrix[0].length; ++j) {
              if (ignoredColIndex !== j) {
                  row.push(matrix[i][j]);
              }
            }
            ret.push(row);
        }

        ret.rows = matrix.rows - 1;
        ret.columns = matrix.columns - 1;
        return ret;
    }

    let sign_from_det_index = function(idx) {
        return idx % 2 === 1 ? -1 : 1;
    }

    // A recursive method to get the determinant of a square matrix
    let determinant = function(matrix) {
        if (matrix.length !== matrix[0].length) {
            // nope
            throw new Numbas.Error("Matrix is not square");
        }

        if (matrix.length === 1) {
            return matrix[1][1];
        }

        if (matrix.length === 2) {
            // do the determinant
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }

        // Otherwise, what we need to do is go through the top row and build up matrixes based on that.
        let top_row = matrix[0];
        let result = 0;
        for (let i = 0; i < matrix.length; ++i) {
            result += top_row[i] * sign_from_det_index(i) * determinant(subsample_matrix(matrix, i));
        }
        return result;
    }

    
    scope.addFunction(new funcObj('create_diag', [TNum,TNum,TList,TList], TMatrix, create_diag, {unwrapValues:true}));
    scope.addFunction(new funcObj('fill_diag', [TMatrix,TList,TList], TMatrix, fill_diag, {unwrapValues:true}));
    scope.addFunction(new funcObj('determinant', [TMatrix], TNum, matrix => new TNum(determinant(matrix)), {unwrapValues:true}));
  });