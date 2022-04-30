const root = d3.select("#ice-hockey-svg");
let rootMatrix;

const COEFFICIENTS = {
    distance_to_attacking_net: -0.8136195893408792,
    all_total_edge: 0.44641096741755704,
    o_avg_edge: 0.7591561782035613,
    o_total_edge: -0.13626790684717613,
    distance_to_attacking_net_all_avg_edge: 0.004418858972436258,
    distance_to_attacking_net_all_total_edge: 0.0025258491554741302,
    distance_to_attacking_net_o_avg_edge: -0.011484871491342245,
    distance_to_attacking_net_o_total_edge: -0.0031081699734241052,
    distance_to_attacking_net_o_avg_edges_per_player: 0.19006035715857053,
    distance_to_attacking_net_d_avg_edge: 0.020719398701219652,
    distance_to_attacking_net_d_total_edge: -0.0011304647509934552,
    distance_to_attacking_net_od_mst_ratio: 0.1757308751159742,
    distance_to_attacking_net_all_ocr: 0.16556908095642012,
    all_avg_edge_all_total_edge: -0.0035317390352814114,
    all_avg_edge_o_avg_edge: 0.007552112708073338,
    all_avg_edge_o_total_edge: -0.005362062825118257,
    all_avg_edge_o_avg_edges_per_player: -1.3116734057439845,
    all_avg_edge_d_avg_edge: 0.1566504672207727,
    all_avg_edge_d_total_edge: -0.02014843010254504,
    all_avg_edge_od_mst_ratio: 0.04086305204493874,
    all_total_edge_o_avg_edge: 0.02216272539889931,
    all_total_edge_o_total_edge: -0.0011726707290296622,
    all_total_edge_o_avg_edges_per_player: 0.07715874930737107,
    all_total_edge_d_avg_edge: -0.038476874178900125,
    all_total_edge_d_total_edge: 0.0025662246495935957,
    all_total_edge_od_mst_ratio: -0.21254774710319194,
    all_total_edge_all_ocr: -0.30652819905416157,
    o_avg_edge_o_total_edge: 0.0017555430248502055,
    o_avg_edge_o_avg_edges_per_player: -0.19757766679203442,
    o_avg_edge_d_avg_edge: -0.06675441576410177,
    o_avg_edge_d_total_edge: -0.01831526737974982,
    o_avg_edge_od_mst_ratio: -0.2388628090478134,
    o_total_edge_o_avg_edges_per_player: -0.07495814690246014,
    o_total_edge_d_avg_edge: 0.01019807272992537,
    o_total_edge_d_total_edge: 0.002353260319754573,
    o_total_edge_od_mst_ratio: 0.03201339370941295,
    o_total_edge_all_ocr: 0.31725285827598415,
    d_avg_edge_d_total_edge: 0.011431063135494211,
    d_avg_edge_od_mst_ratio: 0.7591561782035574,
    d_total_edge_od_mst_ratio: 0.11424597623672843,
    intercept: 0.19408805308026814,
};
// BLUE = offense
// ORANGE = defense

let bluePoints = [
    { x: -20, y: 25, id: "PP1" },
    { x: -20, y: -25, id: "PP2" },
    { x: -20, y: 0, id: "PP3" },
    { x: -50, y: 12.5, id: "PP4" },
    { x: -50, y: -12.5, id: "PP5" },
    { x: -35, y: 0, id: "PP6" },
];

let orangePoints = [
    { x: -85, y: 0, id: "PKG" },
    { x: -40, y: 25, id: "PK1" },
    { x: -40, y: -25, id: "PK2" },
    { x: -40, y: 0, id: "PK3" },
    { x: -70, y: 12.5, id: "PK4" },
    { x: -70, y: -12.5, id: "PK5" },
    { x: -55, y: 0, id: "PK6" },
];

function coordTransform(point) {
    return { ...point, x: point.x + 100, y: 42.5 - point.y };
}

bluePoints = bluePoints.map(coordTransform);
orangePoints = orangePoints.map(coordTransform);

// // EXAMPLE 37 !!!!!
// bluePoints = [
//     { x: 19.93546706, y: 39.26183114, id: "O1" },
//     { x: 35.55114008, y: 66.15101048, id: "O2" },
//     { x: 66.70686142, y: 19.69801718, id: "O3" },
//     { x: 72.65819587, y: 42.08232138, id: "O4" },
//     { x: 30, y: 55, id: "O5" },
//     { x: 45, y: 42.5, id: "O6" },
// ];
//
// orangePoints = [
//     { x: 15.11338869, y: 41.1755338, id: "PKG" },
//     { x: 37.21875084, y: 41.71660071, id: "D1" },
//     { x: 21.7604017, y: 47.67518948, id: "D2" },
//     { x: 22.15365322, y: 34.45199024, id: "D3" },
//     { x: 61.53136585, y: 32.84962419, id: "D4" },
//     { x: 50, y: 55, id: "D5" },
//     { x: 65, y: 42.5, id: "D6" },
// ];
//
// bluePoints = bluePoints.map((p) => ({ ...p, y: 85 - p.y }));
// orangePoints = orangePoints.map((p) => ({ ...p, y: 85 - p.y }));
// /// END EXAMPLE 37

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
        original: _.slice(orangePoints, 0, 6),
        translation: _.map(_.slice(orangePoints, 0, 6), (p) => ({
            id: p.id,
            x: 0,
            y: 0,
        })),
    },
};

let puck = {
    original: { x: 46, y: 34 },
    translation: { x: 0, y: 0 },
};

// // EXAMPLE 37
// puck = {
//     original: { x: 68, y: 44 },
//     translation: { x: 0, y: 0 },
// };
// // END EXAMPLE 37

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

    const full_shifted = _.filter(
        _.flatMap(all_points, (points) => shiftedPoints(points)),
        (o) => o.id !== "PKG"
    );

    const [edges, min_total] = mst(shifted);
    const [full_edges, full_min_total] = mst(full_shifted);

    updateMST(color, min_total, edges, shifted);
    updateMST("overall", full_min_total, full_edges, full_shifted);

    updateProbability();
}

function updateProbability() {
    const prob = calculateProbability();
    d3.select("#probability-widget")
        .select("p")
        .text((prob * 100).toFixed(2) + "%")
        .attr(
            "class",
            // 0 - 20 -> font weight 100
            // X0 - X9.99 -> font weight X00
            // 3.g. 42.2 -> font weight 400
            `weight-${prob * 100 < 20 ? 100 : Math.floor(prob * 10) * 100}`
        );
}

function calculateProbability() {
    // whether config goes out-of-bounds of dataset
    let oob = false;

    let prob = 0;
    const [o_edges, o_total_edge] = mst(shiftedPoints(all_points.blue));
    const [d_edges, d_total_edge] = mst(shiftedPoints(all_points.orange));

    // exclude goalie from full MST
    const full_shifted = _.filter(
        _.flatMap(all_points, (points) => shiftedPoints(points)),
        (o) => o.id !== "PKG"
    );

    const [all_edges, all_total_edge] = mst(full_shifted);
    const puckPosition = {
        x: puck.original.x + puck.translation.x,
        y: puck.original.y + puck.translation.y,
    };
    // goal: x=11, y=42.5
    const dist_net = Math.sqrt(
        Math.pow(puckPosition.x - 11, 2) + Math.pow(puckPosition.y - 42.5, 2)
    );

    const o_avg_edge = o_total_edge / o_edges.length;
    const d_avg_edge = d_total_edge / d_edges.length;
    const full_avg_edge = all_total_edge / all_edges.length;
    const od_mst_ratio = o_avg_edge / d_avg_edge;

    function edges_per_player(edges) {
        const counter = _.countBy(_.flatten(edges), (v) => v);
        return _.mean(_.values(counter));
    }

    const o_avg_edges_per_player = edges_per_player(o_edges);

    function opponent_connectedness_ratio(all_edges) {
        const opponent_edges = _.map(all_edges, ([v1, v2]) => {
            // P of PP versus K of PK
            return v1[1] !== v2[1] ? 1 : 0;
        });
        return _.mean(opponent_edges);
    }

    const ocr = opponent_connectedness_ratio(all_edges);

    // check for out of bounds
    if (dist_net > 50) {
        oob = true;
    }
    d3.select(".alert-danger").style("display", oob ? "flex" : "none");

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
                prob +=
                    COEFFICIENTS[feature] * dist_net * o_avg_edges_per_player;
                break;
            case "distance_to_attacking_net_d_avg_edge":
                prob += COEFFICIENTS[feature] * dist_net * d_avg_edge;
                break;
            case "distance_to_attacking_net_d_total_edge":
                prob += COEFFICIENTS[feature] * dist_net * d_total_edge;
                break;
            case "distance_to_attacking_net_od_mst_ratio":
                prob += COEFFICIENTS[feature] * dist_net * od_mst_ratio;
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
            case "all_avg_edge_o_avg_edges_per_player":
                prob +=
                    COEFFICIENTS[feature] *
                    full_avg_edge *
                    o_avg_edges_per_player;
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
            // case "o_avg_edge_all_ocr":
            //     prob += COEFFICIENTS[feature] * o_avg_edge * ocr;
            //     break;
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
            case "intercept":
                prob += COEFFICIENTS[feature];
                break;
            default:
                break;
        }
    }
    return 1 / (1 + Math.pow(Math.E, -1 * prob));
}

function updateMST(id, min_total, edges, shifted) {
    // d3.select("#custom-bar")
    //     .select("#" + id)
    //     .select("p")
    //     .text(min_total.toFixed(2) + "ft");

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
                .attr("r", 2.5)
                .attr("class", color);
            d3.select(this)
                .append("text")
                .attr("x", d.x)
                .attr("y", d.y)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("class", "dot-text")
                .text(d.id);

            if (d.id === "PKG") {
                let cx = d.x;
                let cy = d.y;
                d3.select(this)
                    .text("")
                    .append("path")
                    .attr(
                        "d",
                        `
                          M -2.75 -1.5
                          A 1.5 1 0 0 1 2.75 -0.5
                          L 0.25 -0.25
                          L 0.75 1.25
                          L 2.75 1.5
                          L 2.75 3.5
                          L 1.75 3.25
                          L 1.25 2.75
                          L -3.05 1.5
                          L -3.05 -0.5
                          L -2.75 -0.75
                          Z
                        `
                    )
                    .attr("transform", `translate(${cx},${cy}) scale(0.8)`)
                    .attr("class", "helmet");

                d3.select(this)
                    .append("path")
                    .attr(
                        "d",
                        `
                              M  0 -0.5
                              L 3.1 -1
                              L 3.5 0.5
                              L 3.1 1.5
                              L 0.3 1
                              Z
                            `
                    )
                    .attr("transform", `translate(${cx},${cy}) scale(0.8)`)
                    .attr("class", "grating-back");

                d3.select(this)
                    .append("path")
                    .attr(
                        "d",
                        `
                        M 0  -0.5
                        L  3.1 -1

                        M 0.1 0
                        L 3.35 -0.25

                        M 0.2 0.5
                        L 3.35 0.5

                        M 0.3 1
                        L 3.25 1.5

                        M 0 -0.5
                        L 0.3 1

                        M 0.75 -0.615
                        L 1 0.5
                        L 0.75 1

                        M 1.5 -0.615
                        L 1.8 0.5
                        L 1.5 1.25

                        M 2.25 -0.75
                        L 2.75 0.5
                        L 2.25 1.25

                        M 3.1 -1
                        L 3.5 0.5
                        L 3.1 1.5
                    `
                    )
                    .attr("transform", `translate(${cx},${cy}) scale(0.8)`)
                    .attr("class", "helmet-grating");
            }
        });

    update(color);

    interact("." + color + "-dot").draggable({
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: d3.select("#background").node(),
                elementRect: { left: 0.5, top: 0.5, bottom: 0.5, right: 0.5 },
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

function setUpPuck() {
    d3.select("#transformations")
        .attr("clip-path", "url(#clipBorder)")
        .append("circle")
        .attr("cx", puck.original.x)
        .attr("cy", puck.original.y)
        .attr("r", 1.5)
        .attr("class", "puck");
    interact(".puck").draggable({
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: d3.select("#possession-perimeter").node(),
                elementRect: { left: 0.5, top: 0.5, bottom: 0.5, right: 0.8 },
                // endOnly: true
            }),
        ],
        listeners: {
            move(event) {
                event.preventDefault();
                // regen root Matrix to account for window size changes
                rootMatrix = root.node().getScreenCTM();

                puck.translation = {
                    x: puck.translation.x + event.dx / rootMatrix.a,
                    y: puck.translation.y + event.dy / rootMatrix.d,
                };

                d3.select(event.target).attr(
                    "transform",
                    `translate(${puck.translation.x}, ${puck.translation.y})`
                );

                updateProbability();
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
        let colorG = d3
            .select("#transformations")
            .attr("clip-path", "url(#clipBorder)")
            .append("g")
            .attr("id", color);
        let widget = d3.select("#custom-bar").append("div").attr("id", color);

        widget
            .append("h3")
            .attr("class", color)
            .style("display", "inline-block")
            .text(color === "blue" ? "Powerplay" : "Penalty Kill");

        let select = widget
            .append("label")
            .attr("for", color + "-select")
            .text("# of Skaters:")
            .append("select")
            .attr("name", color + "-select")
            .attr("id", color + "-select");

        for (let i = 2; i <= 6; i += 1) {
            select
                .append("option")
                .attr("value", i)
                .text(i)
                .property("selected", i === 5);
        }

        select.on("change", function () {
            let value = parseInt(d3.select(this).property("value"));
            // add 1 to accomodate goalie for orange
            value = color === "orange" ? value + 1 : value;
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
            .text("Show Player Connections")
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

        // widget.append("p").text("0 ft");

        setUpPointSet(_.slice(points, 0, color === "blue" ? 5 : 6), color);
    }
    setUpPuck();

    let widget = d3.select("#custom-bar").append("div").attr("id", "overall");
    widget.append("h3").attr("class", "overall").text("Overall");

    widget
        .append("label")
        .attr("for", "overall-show-mst")
        .text("Show Player Connections")
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

    // widget.append("p").text("0 ft");

    update("blue");

    let alert = d3
        .select("#custom-bar")
        .append("span")
        .attr("class", "alert-danger")
        .style("display", "none");

    alert
        .append("svg")
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("height", "1.25rem")
        .attr("fill", "currentColor")
        .attr("class", "bi bi-exclamation-triangle-fill")
        .attr("viewBox", "0 0 16 16")
        .append("path")
        .attr(
            "d",
            "M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
        );

    alert
        .append("div")
        .attr("class", "alert-text")
        .text(
            "This configuration is not contained within the limits of the dataset used to train the Highway model. The probability may be unexpected; take it with a grain of salt."
        );

    const prob = d3
        .select("#custom-bar")
        .append("div")
        .attr("id", "probability-widget");
    prob.append("h3").attr("class", "probability-header").text("Probability");
    prob.append("p").text("0.00%").attr("class", "weight-100");

    updateProbability();
}
