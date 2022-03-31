const root = d3.select("#ice-hockey-svg");
let rootMatrix;

function coordTransform(point) {
    return { ...point, x: point.x + 100, y: 42.5 - point.y };
}

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

function update(points, pointsTranslation, color) {
    let shifted = _.map(_.zip(points, pointsTranslation), ([p, s]) => ({
        id: p.id,
        x: p.x + s.x,
        y: p.y + s.y,
    }));

    const [edges, min_total] = mst(shifted);

    d3.select("#custom-bar")
        .select("#" + color)
        .select("p")
        .text(min_total.toFixed(2) + "ft");

    d3.select("#transformations")
        .select("#" + color)
        .select("#mst")
        .selectAll("*")
        .remove();

    d3.select("#transformations")
        .select("#" + color)
        .select("#mst")
        .selectAll("line")
        .data(edges)
        .join("line")
        .attr("x1", (d) => _.find(shifted, ["id", d[0]]).x)
        .attr("y1", (d) => _.find(shifted, ["id", d[0]]).y)
        .attr("x2", (d) => _.find(shifted, ["id", d[1]]).x)
        .attr("y2", (d) => _.find(shifted, ["id", d[1]]).y)
        .attr("class", color);
}

function setUpPointSet(points, color) {
    let pointsTranslation = _.map(points, (p) => ({
        id: p.id,
        x: 0,
        y: 0,
    }));

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
        });

    update(points, pointsTranslation, color);

    interact("." + color + "-dot").draggable({
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: "#transformations",
                // endOnly: true
            }),
        ],
        listeners: {
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
                update(points, pointsTranslation, color);
                d3.select(event.target).attr(
                    "transform",
                    `translate(${x}, ${y})`
                );
            },
        },
    });
}

export function setup() {
    let bluePoints = [
        { x: -40, y: 25, id: "A" },
        { x: -40, y: -25, id: "B" },
        { x: -40, y: 0, id: "C" },
        { x: -70, y: 12.5, id: "D" },
        { x: -70, y: -12.5, id: "E" },
        { x: -55, y: 0, id: "F" },
    ];

    let orangePoints = bluePoints.map((p) => ({ ...p, x: p.x * -1 }));

    bluePoints = bluePoints.map(coordTransform);
    orangePoints = orangePoints.map(coordTransform);

    for (const [color, points] of [
        ["blue", bluePoints],
        ["orange", orangePoints],
    ]) {
        let widget = d3.select("#custom-bar").append("div").attr("id", color);
        widget.append("h3").attr("class", color).text(color);

        let colorG = d3
            .select("#transformations")
            .attr("clip-path", "url(#clipBorder)")
            .append("g")
            .attr("id", color);

        widget
            .append("label")
            .attr("for", color + "-select")
            .text("# Players");

        let select = widget
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
            setUpPointSet(_.slice(points, 0, value), color);
        });

        widget.append("p").text("0 ft");

        setUpPointSet(_.slice(points, 0, 5), color);
    }
}
