//algorithm from Wikipedia
var debug = false;

var fs  = require("fs");

function backtrack(C, X, Y, i, j) {
    if (i === 0 || j === 0) {
        return "";
    } else if  (X[i] === Y[j]) {
        return backtrack(C, X, Y, i-1, j-1) + X[i];
    } else {
        if (C[i][j-1] > C[i-1][j]) {
            return backtrack(C, X, Y, i, j-1);
        } else {
            return backtrack(C, X, Y, i-1, j);
        }
    }
}
        
fs.readFileSync(process.argv[2]).toString().split('\n').forEach(function (line) {
    if (line !== "") {
        var split = line.split(";");
        var X = split[0];
        var Y = split[1];
        var start = 0;
        var m_end = X.length - 1;
        var n_end = Y.length - 1;
        var m = X.length - 1;
        var n = Y.length - 1;
        
        while (start <= m_end && start <= n_end && X[start] === Y[start]){
            start++;
        }
        
        while (start <= m_end && start <= n_end && X[m_end] === Y[n_end]){
            m_end--;
            n_end--;
        }
        
        var prefix = X.substr(0, start);
        var suffix = X.substr(m_end + 1);

        X = " " + X.substr(start, m_end - start + 1);
        Y = " " + Y.substr(start, n_end - start + 1);
        
		if(debug) {
			console.log("prefix: " + prefix);
			console.log("suffix: " + suffix);
			console.log("start:  " + start);
			console.log("m_end:  " + m_end);
			console.log("n_end:  " + n_end);
			console.log("X:      " + X);
			console.log("Y:      " + Y);
		}

        var m = X.length - 1;
        var n = Y.length - 1;
        
        C = [];
        for(i = 0; i <= m; i++){
            C[i] = [];
            C[i][0] = 0;
        }
        for(i = 0; i <= n; i++){
            C[0][i] = 0;
        }
        
        for(i = 1; i <= m; i++){
            for(j = 1; j <= n; j++){
                if (X[i] === Y[j]){
                    C[i][j] = C[i - 1][j - 1] + 1;
                } else {
                    C[i][j] = C[i][j-1] > C[i-1][j] ? C[i][j-1] : C[i-1][j];
                }
                
            }
        }
        console.log(prefix + backtrack(C,X,Y,m,n) + suffix);
    }
});
