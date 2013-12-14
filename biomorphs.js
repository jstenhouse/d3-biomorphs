
var scale = 0.6;

var mutationRate = 4;

var width = 960;
var height = 700;

var xOffset = width / 2;
var yOffset = height / 2;

var simpleTree = [20, 20, 20, -20, Math.sin(Math.PI / 4.0) * -20, 0, Math.sin(Math.PI / 4.0) * 20, 20, 2];
var tree = [20, 20, 20, -20, Math.sin(Math.PI / 4.0) * -20, 0, Math.sin(Math.PI / 4.0) * 20, 20, 5];
var treeWithBranch = [20, 20, 20, -20, Math.sin(Math.PI / 4.0) * -20, 0, Math.sin(Math.PI / 4.0) * 20, 20, 6];
var tree1 = [30, 20, 20, -20, Math.sin(Math.PI / 4.0) * -20, 0, Math.sin(Math.PI / 4.0) * 20, 20, 5];
var tree2 = [20, 40, 20, -20, Math.sin(Math.PI / 4.0) * -20, 0, Math.sin(Math.PI / 4.0) * 20, 20, 5];
var tree3 = [20, 20, 20, -20, Math.sin(Math.PI / 4.0) * -30, 0, Math.sin(Math.PI / 4.0) * 20, 32, 5];
var insect = [5, 10, 30, -10, Math.sin(Math.PI / 4.0) * -10, 0, Math.sin(Math.PI / 4.0) * 20, 20, 7];
var insect2 = [-5, -1, 2, 3, Math.sin(Math.PI / 4.0) * -5, 0, Math.sin(Math.PI / 2.0) * 5, 3, 11];
var insect3 = [-5, 2, 2, 3, Math.sin(Math.PI / 4.0) * -5, 0, Math.sin(Math.PI / 2.0) * 5, 3, 11];
var insect4 = [-5, 2, 4, 3, Math.sin(Math.PI / 4.0) * -8, 0, Math.sin(Math.PI / 2.0) * 6, 10, 10];
var insect5 = [-5, -1, 2, 3, Math.sin(Math.PI / 4.0) * -5, 0, Math.sin(Math.PI / 2.0) * 5, 3, 11];
var candle = [-15, 10, 20, -10, Math.sin(Math.PI / 4.0) * -10, 0, Math.sin(Math.PI / 4.0) * 2, 10, 8];
var chalice = [-15, 10, 12, -2, Math.sin(Math.PI / 4.0) * -10, 0, Math.sin(Math.PI / 2.0) * 5, 12, 8];
var chalice2 = [-5, 2, 2, -2, Math.sin(Math.PI / 4.0) * -5, 0, Math.sin(Math.PI / 2.0) * 5, 3, 12];
var geome = [-5, 2, 2, 3, Math.sin(Math.PI / 4.0) * -8, 0, Math.sin(Math.PI / 2.0) * -5, 3, 11];

var genomes = [
    {name: 'tree', genome: tree},
    {name: 'candle', genome: candle},
    {name: 'chalice', genome: chalice},
    {name: 'chalice2', genome: chalice2},
    {name: 'geome', genome: geome},
    {name: 'insect', genome: insect},
    {name: 'insect2', genome: insect2},
    {name: 'insect3', genome: insect3},
    {name: 'insect4', genome: insect4},
    {name: 'insect5', genome: insect5},
    {name: 'simpleTree', genome: simpleTree},
    {name: 'treeWithBranch', genome: treeWithBranch},
    {name: 'tree1', genome: tree1},
    {name: 'tree2', genome: tree2},
    {name: 'tree3', genome: tree3}
];

function findGenome(name) {
    for (var i = 0; i < genomes.length; ++i) {
        if (name == genomes[i].name) {
            return genomes[i].genome;
        }
    }
}

function randomGenome() {
    return genomes[Math.round(14 * Math.random())].genome;
}

d3.select("div#genome-select")
    .append("select")
    .attr("id", "genomes")
    .on('change', function() {
        stop();
        var target = findGenome(this.value);
        transition(currentGenome, target);
        currentGenome = target;
    })
    .selectAll("option")
    .data(genomes)
    .enter()
    .append("option")
    .attr("value", function(d) { return d.name; })
    .text(function(d) { return d.name; });

d3.select("div#genome-select")
    .append("button")
    .text("Evolve")
    .on("click", function() {
        start();
    });

d3.select("div#genome-select")
    .append("button")
    .text("Random Transition")
    .on("click", function() {
        stop();
        var random = randomGenome();
        transition(currentGenome, random);
        currentGenome = random;
    });

// default tree
drawBiomorph(tree);

// var savedGenomes = [];

//////////// functions //////////////

// TODO: better scaling for the square...
// TODO: build up lineage after each choice

// transition(treeWithBranch, tree);
// transition(tree, treeWithBranch);
// transition(insect4, insect5);
// transition(tree, insect);
// transition(geome, chalice);

// evolution(insect4);

var currentGenome;
var evolutionId;

function evolution(genome) {
    currentGenome = genome.slice(0);
    drawBiomorph(currentGenome);
    evolutionId = setInterval(function() {
        evolve();
    }, 2000);
}

function start() {
    evolution(currentGenome);
}

function stop() {
    clearInterval(evolutionId);
}

function reset() {
    stop();
    initContainer();
}

// function save() {
//     savedGenomes.push(currentGenome.slice(0));
// }

function evolve() {
    var offspring = mutate(currentGenome);
    transition(currentGenome, offspring);
    currentGenome = offspring;
}

function transition(genomeStart, genomeEnd) {
    var container = initContainer();

    var biomorphStart = generateBiomorph(genomeStart);
    var biomorphEnd = generateBiomorph(genomeEnd);

    // var lines = [];

    // // construct json with 'aaa' key goes to 'from' and 'to'
    // for (var id in biomorphStart) {
    //     var line = {from: {}, to: {}};
    //     line['from'][id] = biomorphStart[id];
    //     if (biomorphEnd.hasOwnProperty(id)) {
    //         line['to'][id] = biomorphEnd[id];
    //     } else {
    //         // make to the same as from so that it transitions out
    //         line['to'][id] = biomorphStart[id];
    //     }
    //     lines.push(line);
    // }

    // // look for id's in end that aren't in start
    // for (var id in biomorphEnd) {

    // }

    // update x1 ... y2 with functions that add offsets and handle transitions

    // var line = container.selectAll("line").data(lines);

    // line.enter().append("line").attr("x1", x1)
    //                             .attr("y1", y1)
    //                             .attr("x2", x2)
    //                             .attr("y2", y2)
    //                             .attr("stroke-width", 2)
    //                             .attr("stroke", "black");

    var lines = {};

    for (var id in biomorphStart) {
        var line = biomorphStart[id];
        var x1 = line["x1"] + xOffset;
        var y1 = line["y1"] + yOffset;
        var x2 = line["x2"] + xOffset;
        var y2 = line["y2"] + yOffset;
        lines[id] = container.append("line").attr("x1", x1)
                                            .attr("y1", y1)
                                            .attr("x2", x2)
                                            .attr("y2", y2)
                                            .attr("stroke-width", 2)
                                            .attr("stroke", "black");
        if (!biomorphEnd.hasOwnProperty(id)) {
            // branch should die
            lines[id].transition().attr("x1", x1)
                                    .attr("y1", y1)
                                    .attr("x2", x1)
                                    .attr("y2", y1)
                                    .delay(600)
                                    .duration(400);
        }
    };

    for (var id in biomorphEnd) {
        var newLine = biomorphEnd[id];
        var x1 = newLine["x1"] + xOffset;
        var y1 = newLine["y1"] + yOffset;
        var x2 = newLine["x2"] + xOffset;
        var y2 = newLine["y2"] + yOffset;
        if (lines.hasOwnProperty(id)) {
            lines[id].transition().attr("x1", x1)
                                    .attr("y1", y1)
                                    .attr("x2", x2)
                                    .attr("y2", y2)
                                    .delay(1000)
                                    .duration(1000);
        } else {
            // new branch
            container.append("line").attr("x1", x1)
                                    .attr("y1", y1)
                                    .attr("x2", x1)
                                    .attr("y2", y1)
                                    .transition()
                                    .attr("x1", x1)
                                    .attr("y1", y1)
                                    .attr("x2", x2)
                                    .attr("y2", y2)
                                    .attr("stroke-width", 2)
                                    .attr("stroke", "black")
                                    .delay(2000)
                                    .duration(400);                
        }
    };
}

function drawBiomorph(genome) {
    reset();
    var container = initContainer();

    currentGenome = genome.slice(0);
    var biomorph = generateBiomorph(currentGenome);

    drawLines(container, xOffset, yOffset, biomorph);
}

// function drawBiomorphsOnGrid(genome) {

//     // build up offspring
//     var genomes = [];
//     for (var i = 0; i < 4; i++) {
//         genomes.push(mutate(genome));
//     };
//     genomes.push(genome);
//     for (var i = 0; i < 4; i++) {
//         genomes.push(mutate(genome));
//     };

//     drawGrid(genomes);
// }

// function drawGrid(genomes) {

//     var container = initContainer();

//     var rows = 3;
//     var columns = 3;

//     var rectWidth = width / columns;
//     var rectHeight = height / rows;

//     var rect = container.selectAll("rect").data(genomes);

//     rect.enter().append("rect").attr("fill", "white")
//                                 .attr("x", function(d, i) {
//                                     return (i % 3) * rectWidth;    
//                                 })
//                                 .attr("y", function(d, i) {
//                                     return Math.floor((i / 3)) * rectHeight;
//                                 })
//                                 .attr("width", rectWidth)
//                                 .attr("height", rectHeight)
//                                 .on("click", function(genome, i) {
//                                     if (i != 4) {
//                                         drawBiomorphsOnGrid(genome);
//                                     }
//                                 })
//                                 .on("mouseover", function() {
//                                     d3.select(this).style("stroke", "gray");
//                                 })
//                                 .on("mouseout", function() {
//                                     d3.select(this).style("stroke", null);
//                                 })
//                                 .each(function(genome, i) {
//                                     var rect = d3.select(this);
//                                     var centerX = (parseInt(rect.attr("width")) / 2) + parseInt(rect.attr("x"));
//                                     var centerY = (parseInt(rect.attr("height")) / 2) + parseInt(rect.attr("y"));
//                                     var biomorph = generateBiomorph(genome);
//                                     // get height and width of biomorph (max x - min x), (max y - min y)
//                                     // if height or width is greater than rect's height, scale ???
//                                     drawLines(container, centerX, centerY + 25, biomorph);
//                                 });
// }

function initContainer() {
    d3.select("svg").remove();
    return d3.select("body").append("svg").attr("width", width).attr("height", height);
}

function generateBiomorph(genome) {
    var branching = genome[8];
    var dx = [
        genome[1] * -1,
        genome[0] * -1,
        0,
        genome[0],
        genome[1],
        genome[2],
        0,
        genome[2] * -1
    ];
    var dy = [
        genome[5],
        genome[4],
        genome[3],
        genome[4],
        genome[5],
        genome[6],
        genome[7],
        genome[6],
    ];

    scaleDecodedGenome(dx, dy);

    var lines = {};
    generateLines("a", 0, 0, branching, 10, dx, dy, lines);

    return lines;
}

// from dawkins' algorithm - http://www.sussex.ac.uk/Users/rudil/FAI_WEB_PAGES/DawkinsBiomorphs.htm
function generateLines(id, x1, y1, length, dir, dx, dy, lines) {
    if (dir < 0) {
        dir += 8;
    } else if (dir >= 8) {
        dir -= 8;
    }

    var x2 = x1 + (length * dx[dir]);
    var y2 = y1 + (length * dy[dir]);

    // don't want zero length lines
    if ((x2 - x1) != 0 || (y2 - y1) != 0) {
        lines[id] = {x1: x1, y1: y1, x2: x2, y2: y2};
    }
    
    if (length > 0) {
        generateLines(id + "a", x2, y2, length - 1, dir - 1, dx, dy, lines);
        generateLines(id + "b", x2, y2, length - 1, dir + 1, dx, dy, lines);
    }
}

function drawLines(container, xOffset, yOffset, lines) {
    for (var key in lines) {
        var x1 = lines[key]["x1"] + xOffset;
        var y1 = lines[key]["y1"] + yOffset;
        var x2 = lines[key]["x2"] + xOffset;
        var y2 = lines[key]["y2"] + yOffset;
        drawLine(container, x1, y1, x2, y2); 
    };
}

function drawLine(container, x1, y1, x2, y2) {
    container.append("line").attr("x1", x1)
                            .attr("y1", y1)
                            .attr("x2", x2)
                            .attr("y2", y2)
                            .attr("stroke-width", 2)
                            .attr("stroke", "black");
}

function mutate(genome) {
    var clone = genome.slice(0);
    var gene = randomGene();
    if (gene == 8) {
        clone[gene] += randomBranchingMutation();
    } else {
        clone[gene] += randomMutation();
    }
    return clone;
}

function randomGene() {
    return Math.round(8 * Math.random());
}

function randomGenes() {
    var genes = [];
    for (var i = 0; i < 3; i++) {
        var gene = randomGene();
        while (genes.indexOf(gene) != -1) {
            gene = randomGene();
        }
        genes.push(gene);
    };
    return genes;
}

function randomSign() {
    return (Math.random() > 0.5) ? -1 : 1;
}

function randomBranchingMutation() {
    return randomSign();
}

function randomMutation() {
    return (mutationRate + Math.random()) * randomSign();
}

function scaleDecodedGenome(dx, dy) {
    for (var i = 0; i < dx.length; i++) {
        dx[i] *= scale;
        dy[i] *= scale;
    };
}
