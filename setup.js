const root = d3.select("#ice-hockey-svg");
let rootMatrix;

const COEFFICIENTS = {
    distance_to_attacking_net: -1.06335725866516,
    all_total_edge: 0.109067920070306,
    o_avg_edge: 0.109014820921215,
    o_total_edge: -0.038473421953592,
    distance_to_attacking_net_all_avg_edge: 0.047406873,
    distance_to_attacking_net_all_total_edge: -0.007092325,
    distance_to_attacking_net_o_avg_edge: -0.007178149,
    distance_to_attacking_net_o_total_edge: -0.000244641,
    distance_to_attacking_net_o_avg_edges_per_player: 0.48751338,
    distance_to_attacking_net_d_avg_edge: 0.001410831,
    distance_to_attacking_net_d_total_edge: 0.006337863,
    distance_to_attacking_net_od_mst_ratio: 0.08577779,
    distance_to_attacking_net_all_ocr: 0.080452988,
    all_avg_edge_all_total_edge: -0.007172556,
    all_avg_edge_o_avg_edge: 0.044713978,
    all_avg_edge_o_total_edge: -0.021925863,
    all_avg_edge_d_avg_edge: 0.021697258,
    all_avg_edge_d_total_edge: 0.00760059,
    all_avg_edge_od_mst_ratio: 0.085664045,
    all_total_edge_o_avg_edge: -0.022334945,
    all_total_edge_o_total_edge: 0.005948557,
    all_total_edge_o_avg_edges_per_player: 0.077896382,
    all_total_edge_d_avg_edge: -0.000565925,
    all_total_edge_d_total_edge: 0.000365751,
    all_total_edge_od_mst_ratio: 0.033630896,
    all_total_edge_all_ocr: -0.103375312,
    o_avg_edge_o_total_edge: 0.012808629,
    o_avg_edge_o_avg_edges_per_player: 0.047041411,
    o_avg_edge_d_avg_edge: -0.024105785,
    o_avg_edge_d_total_edge: 0.014267651,
    o_avg_edge_od_mst_ratio: -0.065625187,
    o_avg_edge_all_ocr: 0.187977095,
    o_total_edge_o_avg_edges_per_player: -0.123988255,
    o_total_edge_d_avg_edge: 0.002378927,
    o_total_edge_d_total_edge: -0.004726159,
    o_total_edge_od_mst_ratio: -0.062027859,
    o_total_edge_all_ocr: 0.043203087,
    d_avg_edge_d_total_edge: -0.010194885,
    d_avg_edge_od_mst_ratio: 0.109014821,
    d_total_edge_od_mst_ratio: -0.003047942,
};

// BLUE = offense
// ORANGE = defense
let bluePoints = [
    { x: -40, y: 25, id: "O1" },
    { x: -40, y: -25, id: "O2" },
    { x: -40, y: 0, id: "O3" },
    { x: -70, y: 12.5, id: "O4" },
    { x: -70, y: -12.5, id: "O5" },
    { x: -55, y: 0, id: "O6" },
];

let orangePoints = [
    { x: -20, y: 25, id: "D1" },
    { x: -20, y: -25, id: "D2" },
    { x: -20, y: 0, id: "D3" },
    { x: -50, y: 12.5, id: "D4" },
    { x: -50, y: -12.5, id: "D5" },
    { x: -35, y: 0, id: "D6" },
];

function coordTransform(point) {
    return { ...point, x: point.x + 100, y: 42.5 - point.y };
}

bluePoints = bluePoints.map(coordTransform);
orangePoints = orangePoints.map(coordTransform);

let all_points = {
    blue: {
        original: _.slice(bluePoints, 0, 5),
        translation: _.map(_.slice(bluePoints, 0, 5), (p) => ({
            id: p.id,
            x: 0,
            y: 0,
        })),
    },
    orange: {
        original: _.slice(orangePoints, 0, 5),
        translation: _.map(_.slice(orangePoints, 0, 5), (p) => ({
            id: p.id,
            x: 0,
            y: 0,
        })),
    },
};

function mst(points) {
    // https://favtutor.com/blogs/prims-algorithm-python
    const N = points.length;
    // create adjacency matrix
    let edges = [];
    let min_total = 0;
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
        min_total += minimum;
        edges.push([points[a].id, points[b].id]);
    }
    return [edges, min_total];
}

function shiftedPoints({ original, translation }) {
    return _.map(_.zip(original, translation), ([p, s]) => ({
        id: p.id,
        x: p.x + s.x,
        y: p.y + s.y,
    }));
}

function update(color) {
    let shifted = shiftedPoints(all_points[color]);

    let full_shifted = _.flatMap(all_points, (points) => shiftedPoints(points));

    const [edges, min_total] = mst(shifted);
    const [full_edges, full_min_total] = mst(full_shifted);

    updateMST(color, min_total, edges, shifted);
    updateMST("overall", full_min_total, full_edges, full_shifted);

    const prob = calculateProbability();
    d3.select("#probability-widget")
        .select("p")
        .text((prob * 100).toFixed(2) + "%");
}

function calculateProbability() {
    let prob = 0;
    const [o_edges, o_total_edge] = mst(shiftedPoints(all_points.blue));
    const [d_edges, d_total_edge] = mst(shiftedPoints(all_points.orange));
    const full_shifted = _.flatMap(all_points, (points) =>
        shiftedPoints(points)
    );
    const [all_edges, all_total_edge] = mst(full_shifted);

    const puckPosition = _.find(shiftedPoints(all_points.blue), ["id", "O1"]);
    // goal: x=11, y=42.5
    const dist_net = Math.sqrt(
        Math.pow(puckPosition.x - 11, 2) + Math.pow(puckPosition.y - 42.5, 2)
    );

    const o_avg_edge = o_total_edge / o_edges.length;
    const d_avg_edge = d_total_edge / d_edges.length;
    const full_avg_edge = all_total_edge / all_edges.length;
    const od_mst_ratio = o_total_edge / d_total_edge;

    function edges_per_player(edges) {
        const counter = _.countBy(_.flatten(edges), (v) => v);
        return _.mean(_.values(counter));
    }

    const o_avg_edges_per_player = edges_per_player(o_edges);

    function opponent_connectedness_ratio(all_edges) {
        const opponent_edges = _.map(all_edges, ([v1, v2]) => {
            return v1[0] !== v2[0] ? 1 : 0;
        });
        return _.mean(opponent_edges);
    }

    const ocr = opponent_connectedness_ratio(all_edges);

    for (const feature in COEFFICIENTS) {
        switch (feature) {
            case "distance_to_attacking_net":
                prob += COEFFICIENTS[feature] * dist_net;
                break;
            case "all_total_edge":
                prob += COEFFICIENTS[feature] * all_total_edge;
                break;
            case "o_avg_edge":
                prob += COEFFICIENTS[feature] * o_avg_edge;
                break;
            case "o_total_edge":
                prob += COEFFICIENTS[feature] * o_total_edge;
                break;
            case "distance_to_attacking_net_all_avg_edge":
                prob += COEFFICIENTS[feature] * dist_net * full_avg_edge;
                break;
            case "distance_to_attacking_net_all_total_edge":
                prob += COEFFICIENTS[feature] * dist_net * all_total_edge;
                break;
            case "distance_to_attacking_net_o_avg_edge":
                prob += COEFFICIENTS[feature] * dist_net * o_avg_edge;
                break;
            case "distance_to_attacking_net_o_total_edge":
                prob += COEFFICIENTS[feature] * dist_net * o_total_edge;
                break;
            case "distance_to_attacking_net_o_avg_edges_per_player":
                prob += COEFFICIENTS[feature] * o_avg_edges_per_player;
                break;
            case "distance_to_attacking_net_d_avg_edge":
                prob += COEFFICIENTS[feature] * dist_net * d_avg_edge;
                break;
            case "distance_to_attacking_net_d_total_edge":
                prob += COEFFICIENTS[feature] * dist_net * d_total_edge;
                break;
            case "distance_to_attacking_net_od_mst_ratio":
                prob += COEFFICIENTS[feature] * od_mst_ratio;
                break;
            case "distance_to_attacking_net_all_ocr":
                prob += COEFFICIENTS[feature] * dist_net * ocr;
                break;
            case "all_avg_edge_all_total_edge":
                prob += COEFFICIENTS[feature] * full_avg_edge * all_total_edge;
                break;
            case "all_avg_edge_o_avg_edge":
                prob += COEFFICIENTS[feature] * full_avg_edge * o_avg_edge;
                break;
            case "all_avg_edge_o_total_edge":
                prob += COEFFICIENTS[feature] * full_avg_edge * o_total_edge;
                break;
            case "all_avg_edge_d_avg_edge":
                prob += COEFFICIENTS[feature] * full_avg_edge * d_avg_edge;
                break;
            case "all_avg_edge_d_total_edge":
                prob += COEFFICIENTS[feature] * full_avg_edge * d_total_edge;
                break;
            case "all_avg_edge_od_mst_ratio":
                prob += COEFFICIENTS[feature] * full_avg_edge * od_mst_ratio;
                break;
            case "all_total_edge_o_avg_edge":
                prob += COEFFICIENTS[feature] * all_total_edge * o_avg_edge;
                break;
            case "all_total_edge_o_total_edge":
                prob += COEFFICIENTS[feature] * all_total_edge * o_total_edge;
                break;
            case "all_total_edge_o_avg_edges_per_player":
                prob +=
                    COEFFICIENTS[feature] *
                    all_total_edge *
                    o_avg_edges_per_player;
                break;
            case "all_total_edge_d_avg_edge":
                prob += COEFFICIENTS[feature] * all_total_edge * d_avg_edge;
                break;
            case "all_total_edge_d_total_edge":
                prob += COEFFICIENTS[feature] * all_total_edge * d_total_edge;
                break;
            case "all_total_edge_od_mst_ratio":
                prob += COEFFICIENTS[feature] * all_total_edge * od_mst_ratio;
                break;
            case "all_total_edge_all_ocr":
                prob += COEFFICIENTS[feature] * all_total_edge * ocr;
                break;
            case "o_avg_edge_o_total_edge":
                prob += COEFFICIENTS[feature] * o_avg_edge * o_total_edge;
                break;
            case "o_avg_edge_o_avg_edges_per_player":
                prob +=
                    COEFFICIENTS[feature] * o_avg_edge * o_avg_edges_per_player;
                break;
            case "o_avg_edge_d_avg_edge":
                prob += COEFFICIENTS[feature] * o_avg_edge * d_avg_edge;
                break;
            case "o_avg_edge_d_total_edge":
                prob += COEFFICIENTS[feature] * o_avg_edge * d_total_edge;
                break;
            case "o_avg_edge_od_mst_ratio":
                prob += COEFFICIENTS[feature] * o_avg_edge * od_mst_ratio;
                break;
            case "o_avg_edge_all_ocr":
                prob += COEFFICIENTS[feature] * o_avg_edge * ocr;
                break;
            case "o_total_edge_o_avg_edges_per_player":
                prob +=
                    COEFFICIENTS[feature] *
                    o_total_edge *
                    o_avg_edges_per_player;
                break;
            case "o_total_edge_d_avg_edge":
                prob += COEFFICIENTS[feature] * o_total_edge * d_avg_edge;
                break;
            case "o_total_edge_d_total_edge":
                prob += COEFFICIENTS[feature] * o_total_edge * d_total_edge;
                break;
            case "o_total_edge_od_mst_ratio":
                prob += COEFFICIENTS[feature] * o_total_edge * od_mst_ratio;
                break;
            case "o_total_edge_all_ocr":
                prob += COEFFICIENTS[feature] * o_total_edge * ocr;
                break;
            case "d_avg_edge_d_total_edge":
                prob += COEFFICIENTS[feature] * d_avg_edge * d_total_edge;
                break;
            case "d_avg_edge_od_mst_ratio":
                prob += COEFFICIENTS[feature] * d_avg_edge * od_mst_ratio;
                break;
            case "d_total_edge_od_mst_ratio":
                prob += COEFFICIENTS[feature] * d_total_edge * od_mst_ratio;
                break;
            default:
                break;
        }
    }
    console.log(prob);
    return Math.pow(10, prob);
}

function updateMST(id, min_total, edges, shifted) {
    d3.select("#custom-bar")
        .select("#" + id)
        .select("p")
        .text(min_total.toFixed(2) + "ft");

    d3.select("#transformations")
        .select("#" + id)
        .select("#mst")
        .selectAll("*")
        .remove();

    d3.select("#transformations")
        .select("#" + id)
        .select("#mst")
        .selectAll("line")
        .data(edges)
        .join("line")
        .attr("x1", (d) => _.find(shifted, ["id", d[0]]).x)
        .attr("y1", (d) => _.find(shifted, ["id", d[0]]).y)
        .attr("x2", (d) => _.find(shifted, ["id", d[1]]).x)
        .attr("y2", (d) => _.find(shifted, ["id", d[1]]).y)
        .attr("class", id);
}

function setUpPointSet(points, color) {
    d3.select("#transformations")
        .attr("clip-path", "url(#clipBorder)")
        .select("#" + color)
        .selectAll("*")
        .remove();

    let colorG = d3
        .select("#transformations")
        .attr("clip-path", "url(#clipBorder)")
        .select("#" + color);

    colorG.append("g").attr("id", "mst");

    let dots = colorG
        .append("g")
        .attr("id", "dots")
        .selectAll("dot")
        .data(points)
        .join("g")
        .attr("class", color + "-dot")
        .attr("data-id", (d) => d.id)
        .each(function (d) {
            d3.select(this)
                .append("circle")
                .attr("cx", d.x)
                .attr("cy", d.y)
                .attr("r", 3)
                .attr("class", color);
            d3.select(this)
                .append("text")
                .attr("x", d.x)
                .attr("y", d.y)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("class", "dot-text")
                .text(d.id);
            if (d.id === "O1") {
                d3.select(this)
                    .append("path")
                    .attr(
                        "d",
                        `M ${d.x + 3} ${d.y} L ${d.x + 4.1} ${d.y + 3.1}`
                    )
                    .attr("class", "stick");
                d3.select(this)
                    .append("path")
                    .attr(
                        "d",
                        `M ${d.x + 4} ${d.y + 3} L ${d.x + 5.5} ${d.y + 2.85} `
                    )
                    .attr("class", "stick-head");
                d3.select(this)
                    .append("circle")
                    .attr("cx", d.x + 4.5)
                    .attr("cy", d.y + 2)
                    .attr("r", 0.5)
                    .attr("class", "pick");
            }
        });

    update(color);

    interact("." + color + "-dot").draggable({
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: "#transformations",
                // endOnly: true
            }),
        ],
        listeners: {
            move(event) {
                event.preventDefault();
                // regen root Matrix to account for window size changes
                rootMatrix = root.node().getScreenCTM();
                let x;
                let y;
                let translation = all_points[color].translation;
                translation = translation.map((point) => {
                    if (point.id === d3.select(event.target).attr("data-id")) {
                        point.x += event.dx / rootMatrix.a;
                        point.y += event.dy / rootMatrix.d;
                        x = point.x;
                        y = point.y;
                    }
                    return point;
                });
                all_points[color].translation = translation;
                update(color);
                d3.select(event.target).attr(
                    "transform",
                    `translate(${x}, ${y})`
                );
            },
        },
    });
}

export function setup() {
    let overallG = d3
        .select("#transformations")
        .attr("clip-path", "url(#clipBorder)")
        .append("g")
        .attr("id", "overall")
        .append("g")
        .attr("id", "mst");
    for (const color in all_points) {
        const points = all_points[color].original;
        let widget = d3.select("#custom-bar").append("div").attr("id", color);

        widget
            .append("h3")
            .attr("class", color)
            .style("display", "inline-block")
            .text(color === "blue" ? "Offensive" : "Defensive");

        let colorG = d3
            .select("#transformations")
            .attr("clip-path", "url(#clipBorder)")
            .append("g")
            .attr("id", color);

        let select = widget
            .append("label")
            .attr("for", color + "-select")
            .text("# Players:")
            .append("select")
            .attr("name", color + "-select")
            .attr("id", color + "-select");

        for (let i = 0; i <= 6; i += 1) {
            select
                .append("option")
                .attr("value", i)
                .text(i)
                .property("selected", i === 5);
        }

        select.on("change", function () {
            const value = d3.select(this).property("value");

            const points = color === "blue" ? bluePoints : orangePoints;
            all_points[color] = {
                original: _.slice(points, 0, value),
                translation: _.map(_.slice(points, 0, value), (p) => ({
                    id: p.id,
                    x: 0,
                    y: 0,
                })),
            };
            setUpPointSet(all_points[color].original, color);
        });

        widget
            .append("label")
            .attr("for", color + "-show-mst")
            .text("Show MST")
            .append("input")
            .attr("type", "checkbox")
            .attr("id", color + "-show-mst")
            .property("checked", true)
            .on("click", function () {
                if (d3.select(this).property("checked")) {
                    d3.select("#transformations")
                        .select("#" + color)
                        .select("#mst")
                        .style("visibility", "visible");
                } else {
                    d3.select("#transformations")
                        .select("#" + color)
                        .select("#mst")
                        .style("visibility", "hidden");
                }
            });

        widget.append("p").text("0 ft");

        setUpPointSet(_.slice(points, 0, 5), color);
    }

    let widget = d3.select("#custom-bar").append("div").attr("id", "overall");
    widget.append("h3").attr("class", "overall").text("Overall");

    widget
        .append("label")
        .attr("for", "overall-show-mst")
        .text("Show MST")
        .append("input")
        .attr("type", "checkbox")
        .attr("id", "overall-show-mst")
        .property("checked", true)
        .on("click", function () {
            if (d3.select(this).property("checked")) {
                d3.select("#transformations")
                    .select("#overall")
                    .select("#mst")
                    .style("visibility", "visible");
            } else {
                d3.select("#transformations")
                    .select("#overall")
                    .select("#mst")
                    .style("visibility", "hidden");
            }
        });

    widget.append("p").text("0 ft");

    update("blue");

    const prob = d3
        .select("#custom-bar")
        .append("div")
        .attr("id", "probability-widget");
    prob.append("h3").text("Probability");
    prob.append("p").text("0%");
}
