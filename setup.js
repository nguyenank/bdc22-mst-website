const root = d3.select("#ice-hockey-svg");
let rootMatrix;

const COEFFICIENTS = {
    distance_to_attacking_net: -0.5117710236128704,
    all_avg_edge: 0.0,
    all_total_edge: 0.9632001750301332,
    o_avg_edge: 0.12386221490821661,
    o_total_edge: 0.0,
    d_avg_edge: 0.0,
    d_total_edge: -0.16649753108460688,
    distance_to_attacking_net_all_avg_edge: 0.014168021338025505,
    distance_to_attacking_net_all_total_edge: 0.0016123056120001126,
    distance_to_attacking_net_o_avg_edge: 0.005325942128616791,
    distance_to_attacking_net_o_total_edge: -0.002758611110526673,
    distance_to_attacking_net_o_avg_edges_per_player: 0.19179565916094415,
    distance_to_attacking_net_d_avg_edge: -0.03014910890481473,
    distance_to_attacking_net_d_total_edge: 0.006488337389360191,
    distance_to_attacking_net_od_mst_ratio: -0.0006218131017897475,
    distance_to_attacking_net_all_ocr: -0.003012732419516466,
    all_avg_edge_all_total_edge: 0.0007820894360218025,
    all_avg_edge_o_avg_edge: -0.08823678364512753,
    all_avg_edge_o_total_edge: 0.013672815505794501,
    all_avg_edge_o_avg_edges_per_player: 0.0,
    all_avg_edge_d_avg_edge: 0.14117033921853098,
    all_avg_edge_d_total_edge: -0.02205294398830438,
    all_total_edge_o_avg_edge: 0.026501464357424995,
    all_total_edge_o_total_edge: -0.0002707885598943372,
    all_total_edge_o_avg_edges_per_player: -0.49669268201251854,
    all_total_edge_d_avg_edge: 0.012579787182732274,
    all_total_edge_d_total_edge: -0.01567698757201078,
    all_total_edge_od_mst_ratio: -0.19297815044334954,
    o_avg_edge_o_total_edge: -0.021173463101817388,
    o_avg_edge_o_avg_edges_per_player: 0.0,
    o_avg_edge_d_avg_edge: -0.2066256271054176,
    o_avg_edge_d_total_edge: 0.04612027015366954,
    o_avg_edge_all_ocr: 0.3970480393666622,
    o_total_edge_o_avg_edges_per_player: 0.04734342692620169,
    o_total_edge_d_avg_edge: 0.009008541431360343,
    o_total_edge_d_total_edge: 0.004901297257373206,
    o_total_edge_od_mst_ratio: 0.10557875459705991,
    o_total_edge_all_ocr: 0.08965266996902403,
    o_avg_edges_per_player_d_avg_edge: 0.0,
    o_avg_edges_per_player_d_total_edge: 0.07616379925331444,
    d_avg_edge_d_total_edge: 0.02160181065288565,
    d_avg_edge_od_mst_ratio: 0.1251148425961676,
    d_avg_edge_all_ocr: -0.17620014497130002,
    d_total_edge_all_ocr: -0.2554098767862022,
    od_mst_ratio_all_ocr: 0.0,
    intercept: 0.10908353250844258,
};
// BLUE = offense
// ORANGE = defense

let bluePoints = [
    { x: -40, y: 17.5, id: "PP1" },
    { x: -40, y: -17.5, id: "PP2" },
    { x: -40, y: 0, id: "PP3" },
    { x: -75, y: 12.5, id: "PP4" },
    { x: -75, y: -12.5, id: "PP5" },
    { x: -30, y: 0, id: "PP6" },
];

let orangePoints = [
    { x: -85, y: 0, id: "PKG" },
    { x: -55, y: 10, id: "PK1" },
    { x: -55, y: -10, id: "PK2" },
    { x: -55, y: 0, id: "PK3" },
    { x: -70, y: 5.5, id: "PK4" },
    { x: -70, y: -5.5, id: "PK5" },
    { x: -55, y: 0, id: "PK6" },
];

function coordTransform(point) {
    return { ...point, x: point.x + 100, y: 42.5 - point.y };
}

bluePoints = bluePoints.map(coordTransform);
orangePoints = orangePoints.map(coordTransform);

// // GAME STATE 278
// bluePoints = [
//     { x: 161.48614995, y: 34.98625728, id: "PP1" },
//     { x: 149.57430128, y: 47.93555676, id: "PP2" },
//     { x: 183.99304817, y: 44.20754878, id: "PP3" },
//     { x: 193.155324242, y: 37.83905482, id: "PP4" },
//     { x: 30, y: 55, id: "PP5" },
//     { x: 45, y: 42.5, id: "PP6" },
// ];
//
// orangePoints = [
//     { x: 185.71452227999998, y: 45.30548697, id: "PKG" },
//     { x: 163.69497278, y: 44.18600701, id: "PK1" },
//     { x: 178.77691262000002, y: 39.15386686, id: "PK2" },
//     { x: 172.96058382, y: 41.01530732, id: "PK3" },
//     { x: 181.442231445, y: 44.63325568, id: "PK4" },
//     { x: 50, y: 55, id: "PK5" },
//     { x: 65, y: 42.5, id: "PK6" },
// ];
//
// bluePoints = bluePoints.map((p) => ({ ...p, x: 200 - p.x, y: p.y }));
// orangePoints = orangePoints.map((p) => ({ ...p, x: 200 - p.x, y: p.y }));
// /// END EXAMPLE 278

// // GAME STATE 12
// bluePoints = [
//     { x: 193.5200779, y: 54.49927713, id: "PP1" },
//     { x: 178.8821184, y: 45.11970616, id: "PP2" },
//     { x: 164.2572005, y: 61.31611991, id: "PP3" },
//     { x: 172.7310709, y: 32.30735118, id: "PP4" },
//     { x: 30, y: 55, id: "PP5" },
//     { x: 45, y: 42.5, id: "PP6" },
// ];
//
// orangePoints = [
//     { x: 186.7959313, y: 43.30975619, id: "PKG" },
//     { x: 180.207008, y: 40.47272063, id: "PK1" },
//     { x: 170.2668153, y: 57.15182737, id: "PK2" },
//     { x: 169.0266244, y: 37.01447798, id: "PK3" },
//     { x: 176.418101, y: 56.0165059, id: "PK4" },
//     { x: 50, y: 55, id: "PK5" },
//     { x: 65, y: 42.5, id: "PK6" },
// ];
//
// bluePoints = bluePoints.map((p) => ({ ...p, x: 200 - p.x, y: p.y }));
// orangePoints = orangePoints.map((p) => ({ ...p, x: 200 - p.x, y: p.y }));
// /// END GAME STATE 12

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
    original: { x: 56, y: 45 },
    translation: { x: 0, y: 0 },
};

// // EXAMPLE 278
// puck = {
//     original: { x: 200 - 154, y: 51 },
//     translation: { x: 0, y: 0 },
// };
// // END EXAMPLE 278

// // EXAMPLE 12
// puck = {
//     original: { x: 200 - 181, y: 45 },
//     translation: { x: 0, y: 0 },
// };
// // END EXAMPLE 12

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

    function angle(x, y) {
        if (x >= 11) {
            const xdiff = x - 11;
            const ydiff = y - 42.5;
            return 180 - (Math.atan2(xdiff, ydiff) * 180) / Math.PI;
        } else {
            const xdiff = 11 - x;
            const ydiff = y - 42.5;
            return -180 + (Math.atan2(xdiff, ydiff) * 180) / Math.PI;
        }
    }

    const angle_to_attacking_net = angle(puckPosition.x, puckPosition.y);

    const o_avg_edge = o_total_edge / o_edges.length;
    const d_avg_edge = d_total_edge / d_edges.length;
    const all_avg_edge = all_total_edge / all_edges.length;
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
    function out_of_bounds(minimum, maximum, variable) {
        return variable < minimum || variable > maximum;
    }

    const oob_checks = [
        out_of_bounds(6.800735254, 96.9703563, dist_net),
        out_of_bounds(4.935694122, 27.88383144, all_avg_edge),
        out_of_bounds(29.61416473, 167.3029887, all_total_edge),
        out_of_bounds(4.501513775, 44.08701061, o_avg_edge),
        out_of_bounds(4.501513775, 144.1423372, o_total_edge),
        out_of_bounds(1, 1.666666667, o_avg_edges_per_player),
        out_of_bounds(5.403451211, 40.67138455, d_avg_edge),
        out_of_bounds(17.05970846, 103.5577001, d_total_edge),
        out_of_bounds(0.32849809, 4.409040516, od_mst_ratio),
        out_of_bounds(0.111111111, 1, ocr),
        out_of_bounds(2.0095538, 358.3397176, angle_to_attacking_net),
    ];

    oob = _.some(oob_checks, Boolean);
    d3.select(".alert-danger").style("display", oob ? "flex" : "none");

    for (const feature in COEFFICIENTS) {
        switch (feature) {
            case "distance_to_attacking_net":
                prob += COEFFICIENTS[feature] * dist_net;
                break;
            case "all_avg_edge":
                prob += COEFFICIENTS[feature] * all_avg_edge;
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
            case "d_avg_edge":
                prob += COEFFICIENTS[feature] * d_avg_edge;
                break;
            case "d_total_edge":
                prob += COEFFICIENTS[feature] * d_total_edge;
                break;
            case "distance_to_attacking_net_all_avg_edge":
                prob += COEFFICIENTS[feature] * dist_net * all_avg_edge;
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
            case "distance_to_attacking_net_angle_to_attacking_net":
                prob +=
                    COEFFICIENTS[feature] * dist_net * angle_to_attacking_net;
                break;
            case "all_avg_edge_all_total_edge":
                prob += COEFFICIENTS[feature] * all_avg_edge * all_total_edge;
                break;
            case "all_avg_edge_o_avg_edge":
                prob += COEFFICIENTS[feature] * all_avg_edge * o_avg_edge;
                break;
            case "all_avg_edge_o_total_edge":
                prob += COEFFICIENTS[feature] * all_avg_edge * o_total_edge;
                break;
            case "all_avg_edge_o_avg_edges_per_player":
                prob +=
                    COEFFICIENTS[feature] *
                    all_avg_edge *
                    o_avg_edges_per_player;
                break;
            case "all_avg_edge_d_avg_edge":
                prob += COEFFICIENTS[feature] * all_avg_edge * d_avg_edge;
                break;
            case "all_avg_edge_d_total_edge":
                prob += COEFFICIENTS[feature] * all_avg_edge * d_total_edge;
                break;
            case "all_avg_edge_od_mst_ratio":
                prob += COEFFICIENTS[feature] * all_avg_edge * od_mst_ratio;
                break;
            case "all_avg_edge_angle_to_attacking_net":
                prob +=
                    COEFFICIENTS[feature] *
                    all_avg_edge *
                    angle_to_attacking_net;
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
            case "all_total_edge_angle_to_attacking_net":
                prob +=
                    COEFFICIENTS[feature] *
                    all_total_edge *
                    angle_to_attacking_net;
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
            case "o_avg_edge_angle_to_attacking_net":
                prob +=
                    COEFFICIENTS[feature] * o_avg_edge * angle_to_attacking_net;
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
            case "o_total_edge_angle_to_attacking_net":
                prob +=
                    COEFFICIENTS[feature] *
                    o_total_edge *
                    angle_to_attacking_net;
                break;
            case "o_avg_edges_per_player_d_avg_edge":
                prob +=
                    COEFFICIENTS[feature] * o_avg_edges_per_player * d_avg_edge;
                break;
            case "o_avg_edges_per_player_d_total_edge":
                prob +=
                    COEFFICIENTS[feature] *
                    o_avg_edges_per_player *
                    d_total_edge;
                break;
            case "d_avg_edge_d_total_edge":
                prob += COEFFICIENTS[feature] * d_avg_edge * d_total_edge;
                break;
            case "d_avg_edge_od_mst_ratio":
                prob += COEFFICIENTS[feature] * d_avg_edge * od_mst_ratio;
                break;
            case "d_avg_edge_all_ocr":
                prob += COEFFICIENTS[feature] * d_avg_edge * ocr;
                break;
            case "d_avg_edge_angle_to_attacking_net":
                prob +=
                    COEFFICIENTS[feature] * d_avg_edge * angle_to_attacking_net;
                break;
            case "d_total_edge_od_mst_ratio":
                prob += COEFFICIENTS[feature] * d_total_edge * od_mst_ratio;
                break;
            case "d_total_edge_all_ocr":
                prob += COEFFICIENTS[feature] * d_total_edge * ocr;
                break;
            case "d_total_edge_angle_to_attacking_net":
                prob +=
                    COEFFICIENTS[feature] *
                    d_total_edge *
                    angle_to_attacking_net;
                break;
            case "od_mst_ratio_angle_to_attacking_net":
                prob +=
                    COEFFICIENTS[feature] *
                    od_mst_ratio *
                    angle_to_attacking_net;
                break;
            case "od_mst_ratio_all_ocr":
                prob += COEFFICIENTS[feature] * od_mst_ratio * ocr;
                break;
            case "all_ocr_angle_to_attacking_net":
                prob += COEFFICIENTS[feature] * ocr * angle_to_attacking_net;
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
            .text(color === "blue" ? "Power Play" : "Penalty Kill");

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
    widget.append("h3").attr("class", "overall").text("All Skaters");

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
    prob.append("h3").attr("class", "probability-header").text("Dangerous Situation Probability");
    prob.append("p").text("0.00%").attr("class", "weight-100");

    updateProbability();
}
