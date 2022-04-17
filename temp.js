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
    return Math.pow(Math.E, prob);
}
