let points = [
    { x: -40, y: 25, id: "b1" },
    { x: -40, y: -25, id: "b2" },
    { x: -40, y: 0, id: "b3" },
    { x: -70, y: 12.5, id: "b4" },
    { x: -70, y: -12.5, id: "b5" },
];

let pointsTranslation = [
    { x: 0, y: 0, id: "b1" },
    { x: 0, y: 0, id: "b2" },
    { x: 0, y: 0, id: "b3" },
    { x: 0, y: 0, id: "b4" },
    { x: 0, y: 0, id: "b5" },
];

function coordTransform(point) {
    return { ...point, x: point.x + 100, y: 42.5 - point.y };
}

function mst(points) {
    // https://favtutor.com/blogs/prims-algorithm-python
    const N = points.length;
    // create adjacency matrix
    let edges = [];
    let am = [];
    for (let pointA of points) {
        let row = [];
        for (let pointB of points) {
            row.push(
                Math.sqrt(
                    (pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2
                )
            );
        }
        am.push(row);
    }
    // Prims's algorithm
    let no_edge = 0;
    let selected_node = Array(N);
    selected_node[0] = true;
    while (no_edge < N - 1) {
        let minimum = 99999;
        let a = 0;
        let b = 0;
        for (let m = 0; m < N; m += 1) {
            if (selected_node[m]) {
                for (let n = 0; n < N; n += 1) {
                    if (!selected_node[n] && am[m][n]) {
                        // # not in selected and there is an edge
                        if (minimum > am[m][n]) {
                            minimum = am[m][n];
                            a = m;
                            b = n;
                        }
                    }
                }
            }
        }
        selected_node[b] = true;
        no_edge += 1;
        edges.push([points[a].id, points[b].id]);
    }
    return edges;
}

function lines() {
    let shifted = _.map(_.zip(points, pointsTranslation), ([p, s]) => ({
        id: p.id,
        x: p.x + s.x,
        y: p.y + s.y,
    }));

    const edges = mst(shifted);

    d3.select("#mst").selectAll("*").remove();
    d3.select("#mst")
        .selectAll("line")
        .data(edges)
        .join("line")
        .attr("x1", (d) => _.find(shifted, ["id", d[0]]).x)
        .attr("y1", (d) => _.find(shifted, ["id", d[0]]).y)
        .attr("x2", (d) => _.find(shifted, ["id", d[1]]).x)
        .attr("y2", (d) => _.find(shifted, ["id", d[1]]).y)
        .attr("stroke", "black")
        .attr("stroke-width", "1");
}

points = points.map(coordTransform);

const root = d3.select("#ice-hockey-svg");
let rootMatrix;

export function setup() {
    d3.select("#transformations").append("g").attr("id", "mst");
    let dots = d3
        .select("#transformations")
        .attr("clip-path", "url(#clipBorder)")
        .append("g")
        .attr("id", "dots")
        .selectAll("dot")
        .data(points)
        .join("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("data-id", (d) => d.id)
        .attr("r", 3)
        .style("fill", "blue")
        .attr("class", "dot");

    lines(points);

    interact(".dot").draggable({
        listeners: {
            start(event) {
                console.log(event.type, event.target);
            },
            move(event) {
                // regen root Matrix to account for window size changes
                rootMatrix = root.node().getScreenCTM();
                let x;
                let y;
                pointsTranslation = pointsTranslation.map((point) => {
                    if (point.id === d3.select(event.target).attr("data-id")) {
                        point.x += event.dx / rootMatrix.a;
                        point.y += event.dy / rootMatrix.d;
                        x = point.x;
                        y = point.y;
                    }
                    return point;
                });
                lines();
                d3.select(event.target).attr(
                    "transform",
                    `translate(${x}, ${y})`
                );
            },
            end(event) {
                console.log();
            },
        },
    });

    // interact(".dot").draggable({
    //     inertia: false,
    //     autoScroll: false,
    //     listeners: {
    //         // call this function on every dragmove event
    //         move: dragMoveListener,
    //     },
    // });
}
