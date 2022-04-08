const root = d3.select("#ice-hockey-svg");
let rootMatrix;

let secondsLastShot = 30;

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

function update(color) {
    const { original, translation } = all_points[color];
    let shifted = _.map(_.zip(original, translation), ([p, s]) => ({
        id: p.id,
        x: p.x + s.x,
        y: p.y + s.y,
    }));

    let full_shifted = _.flatMap(all_points, (points) => {
        const { original, translation } = points;
        return _.map(_.zip(original, translation), ([p, s]) => ({
            id: p.id,
            x: p.x + s.x,
            y: p.y + s.y,
        }));
    });

    const [edges, min_total] = mst(shifted);
    const [full_edges, full_min_total] = mst(full_shifted);

    updateMST(color, min_total, edges, shifted);
    updateMST("overall", full_min_total, full_edges, full_shifted);
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

    const sls = d3
        .select("#custom-bar")
        .append("div")
        .attr("id", "second-last-shot-widget");
    sls.append("h3").text("Other");
    sls.append("label")
        .attr("id", "seconds-last-shot-label")
        .attr("for", "seconds-last-shot")
        .text("Seconds Since Last Shot:");
    sls.append("input")
        .attr("id", "seconds-last-shot-range")
        .attr("name", "seconds-last-shot")
        .attr("type", "range")
        .attr("min", 0)
        .attr("max", 120)
        .property("value", secondsLastShot)
        .on("change", (e) => {
            secondsLastShot = e.target.value;
            d3.select("#seconds-last-shot-box").property(
                "value",
                e.target.value
            );
        });
    sls.append("input")
        .attr("type", "number")
        .attr("id", "seconds-last-shot-box")
        .attr("min", 0)
        .attr("max", 120)
        .property("value", secondsLastShot)
        .on("change", (e) => {
            secondsLastShot = e.target.value;
            d3.select("#seconds-last-shot-range").property(
                "value",
                e.target.value
            );
        });
}
