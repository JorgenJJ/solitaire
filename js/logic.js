let map =  [[0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 2, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0]];

let prevClick = null;
let prevClass = null;
let history = [];
let hi = 0;

let index = 0;


function displayMap(map) {
    let parent = document.getElementById("body");
    let cont = document.createElement("div");
    let at = document.createAttribute("class");
    at.value = "board_container";
    cont.setAttributeNode(at);

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            let box = document.createElement("div");
            let a = document.createAttribute("id");
            let c = document.createAttribute("class");
            let k = document.createAttribute("onclick");
            a.value = index++;
            k.value = "handleClick(this)";

            if (map[i][j] < 1) {
                c.value = "box closed";
            }
            else if (map[i][j] > 1) {
                c.value = "box empty";
            }
            else {
                c.value = "box full";
            }
            box.innerHTML = map[i][j];
            box.setAttributeNode(a);
            box.setAttributeNode(c);
            box.setAttributeNode(k);
            cont.appendChild(box);
        }
    }
    parent.appendChild(cont);
}

function handleClick(elem) {
    let cId = parseInt(elem.id);
    let cValue = parseInt(elem.innerHTML);

    if (prevClick == null) {
        if (document.getElementById(cId).className != "box closed") {
            prevClick = cId;
            prevClass = elem.className;
            elem.className = elem.className + " clicked";
            elem.style.backgroundColor = "lightseagreen";
        }
    }
    else {
        if (checkValidClick(cId, prevClick)) {
            move(cId, prevClick);
        }

        updateClasses();
        document.getElementById(prevClick).className = prevClass;
        prevClick = null;
        prevClass = null;
    }
}

function move(id, prev) {
    let mid = (prev - id) / 2;
    if (document.getElementById(id + mid).innerHTML != 2) {
        let jumpedFrom = document.getElementById(prev);
        let jumpedOver = document.getElementById(id + mid);
        let jumpedTo = document.getElementById(id);
        jumpedFrom.style.backgroundColor = "greenyellow";
        jumpedFrom.innerHTML = 2;
        jumpedOver.style.backgroundColor = "greenyellow";
        jumpedOver.innerHTML = 2;
        jumpedTo.style.backgroundColor = "green";
        jumpedTo.innerHTML = 1;
    }
}

function checkValidClick(id, prev, list) {
    if (id < 0 || prev < 0 || id >= index || prev >= index) return false;
    if (list == null) {
        if (id == prev - 2 || id == prev + 2 
            || id == prev - 14 || id == prev + 14) {
                if (document.getElementById(id).className == "box empty") {
                    return true;
                }
        }
    }
    else {
        if (list[id] == 2 && list[prev] == 1) {
            if (list[id] == 0 || list[prev] == 0) return false;

            if (id == prev - 2 || id == prev + 2) {
                if (id == prev - 2 && (prev % 7 != 0 && prev % 7 != 1) && list[prev - 1] == 1) {
                    return true;
                }
                else if (id == prev + 2 && (prev % 7 != 5 && prev % 7 != 6) && list[prev + 1] == 1) {
                    return true;
                }
            }
            else if (id == prev - 14 || id == prev + 14) {
                return true;
            }
        }
    }
    return false;
}

function isEmpty(id) {
    if (parseInt(document.getElementById(id).innerHTML) == 2) return true;
    else return false;
}

function isEmpty(id, list) {
    if (list[id] == 2) return true;
    else return false;
}

function isNotSolved(l) {
    let c = 0;
    for (let i = 0; i < index; i++) {
        if (l[i] == 1) c++; 
    }
    if (c == 1) return false;
    else return c;
}

function updateClasses() {
    for (let i = 0; i < index; i++) {
        let ind = document.getElementById(i);
        if (parseInt(ind.innerHTML) < 1) {
            ind.className = "box closed";
            ind.style.backgroundColor = "grey";
        }
        else if (parseInt(ind.innerHTML) > 1) {
            ind.className = "box empty";
            ind.style.backgroundColor = "greenyellow";
        }
        else {
            ind.className = "box full";
            ind.style.backgroundColor = "green";
        }
    }
}

function solve() {
    let l = [];
    for (let i = 0; i < index; i++) {
        l[i] = parseInt(document.getElementById(i).innerHTML);
    }

    let res = solver(l);

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            map[i][j] = res[(i * 7) + j];
        }
    }
    
    /*
    if (res) {
        for (let i = 0; i < res.length; i++) {
            document.getElementById(i).innerHTML = res[i];
            updateClasses();
        }
    }
    else {
        console.log("No solution found");
    }
    */
    showProcess();
}

let gen = 0;
function solver(ol) {
    let localgen = ++gen;
    let l = [];
    l = copyArray(ol, l);
    let vm = [];
    /*console.log(l[0] + " " + l[1] + " " + l[2] + " " + l[3] + " " + l[4] + " " + l[5] + " " + l[6] + "\n" + 
    l[7] + " " + l[8] + " " + l[9] + " " + l[10] + " " + l[11] + " " + l[12] + " " + l[13] + "\n" + 
    l[14] + " " + l[15] + " " + l[16] + " " + l[17] + " " + l[18] + " " + l[19] + " " + l[20] + "\n" + 
    l[21] + " " + l[22] + " " + l[23] + " " + l[24] + " " + l[25] + " " + l[26] + " " + l[27] + "\n" + 
    l[28] + " " + l[29] + " " + l[30] + " " + l[31] + " " + l[32] + " " + l[33] + " " + l[34] + "\n" + 
    l[35] + " " + l[36] + " " + l[37] + " " + l[38] + " " + l[39] + " " + l[40] + " " + l[41] + "\n" + 
    l[42] + " " + l[43] + " " + l[44] + " " + l[45] + " " + l[46] + " " + l[47] + " " + l[48]);
    */
    if (!isNotSolved(l)) return l;
    else {
        let left = isNotSolved(l);
        //console.log("Pins left: " + left);
        if (left == 1) alert("2 left");
    }

    for (let i = 0; i < l.length; i++) {
        vm[i] = [];
        vm[i].push(l[i]);
        vm[i].push([]);
        if (checkValidClick(i + 2, i, l) && !isEmpty(i + 1, l)) vm[i][1].push(i + 2);
        else if (checkValidClick(i + 14, i, l) && !isEmpty(i + 7, l)) vm[i][1].push(i + 14);
        else if (checkValidClick(i - 2, i, l) && !isEmpty(i - 1, l)) vm[i][1].push(i - 2);
        else if (checkValidClick(i - 14, i, l) && !isEmpty(i - 7, l)) vm[i][1].push(i - 14);
    }

    let cc = 0;
    for (let i = 0; i < vm.length; i++) {
        cc += vm[i][1].length;
        for (let j = 0; j < vm[i][1].length; j++) {
            //console.log("From " + i + " to " + vm[i][1][j]);
        }
    }
    if (cc == 0 && isNotSolved(l)) {
        //console.log("No more moves");
        return false;
    }
    else if (cc == 0 && !isNotSolved(l)) return l;
    else if (cc > 0) {
        //console.log("Possible moves: " + cc);
    }

    //alert("PAUSE");
    
    for (let i = 0; i < l.length; i++) {
        if (vm[i][1].length > 0) {
            //let n = [];
            //n = copyArray(l, n);
            for (let j = 0; j < vm[i][1].length; j++) {
                //console.log("Solver generation: " + localgen);
                let mid = (i - vm[i][1][j]) / 2;
                //console.log("i (from): " + i + " mid (over): " + mid * -1 + " vm (to): " + vm[i][1][j]);
                l[i] = 2;
                l[vm[i][1][j]] = 1;
                l[i + (mid * -1)] = 2;

                hi++;
                history[hi] = l.concat();

                let res = solver(l);
                if (res != false) {
                    hi++;
                    return res;
                }

                history.splice(localgen, 1);
                hi--;

                l[i] = 1;
                l[vm[i][1][j]] = 2;
                l[i + (mid * -1)] = 1;
            }
        }
    }
    return false;
}

function showProcess() {
    let i = 1;
    let timer = 200;
    let interval = setInterval(() => {
        for (let x = 0; x < history[i].length; x++) {
            document.getElementById(x).innerHTML = history[i][x];
            updateClasses();
        }
        i++;
        if (i >= history.length) {
            clearInterval(interval);
        }
    }, timer);
}

function copyArray(a1, a2) {
    for (i = 0; i < a2.length; i++) {
      if (a1 == undefined) a1 = [];
      a1[i] = [];
      a1[i] = Array.from(a2[i]);
    }
    return a1;
}

document.getElementById("body").onload = function() {
    displayMap(map);
}


