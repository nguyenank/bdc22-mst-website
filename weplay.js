const root = d3.select("#ice-hockey-svg");
let rootMatrix;

// BLUE = offense
// ORANGE = defense

let bluePoints = [
    { x: -40, y: 17.5, id: "PP1" },
    { x: -40, y: -17.5, id: "PP2" },
    { x: -40, y: 0, id: "PP3" },
    { x: -75, y: 12.5, id: "PP4" },
    { x: -75, y: -12.5, id: "PP5" },
    { x: -30, y: 0, id: "PP6" }
];

let orangePoints = [
    { x: -85, y: 0, id: "PKG" },
    { x: -55, y: 10, id: "PK1" },
    { x: -55, y: -10, id: "PK2" },
    { x: -55, y: 0, id: "PK3" },
    { x: -70, y: 5.5, id: "PK4" },
    { x: -70, y: -5.5, id: "PK5" },
    { x: -55, y: 0, id: "PK6" }
];

let metric;

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
            y: 0
        }))
    },
    orange: {
        original: _.slice(orangePoints, 0, 6),
        translation: _.map(_.slice(orangePoints, 0, 6), (p) => ({
            id: p.id,
            x: 0,
            y: 0
        }))
    }
};

function shiftedPoints({ original, translation }) {
    return _.map(_.zip(original, translation), ([p, s]) => ({
        id: p.id,
        x: p.x + s.x,
        y: p.y + s.y
    }));
}

function update(color) {
    let shifted = shiftedPoints(all_points[color]);

    const full_shifted = _.filter(
        _.flatMap(all_points, (points) => shiftedPoints(points)),
        (o) => o.id !== "PKG"
    );
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

            if (d.id === "PP1") {
                d3.select(this)
                    .append("path")
                    .attr(
                        "d",
                        `M ${d.x - 3} ${d.y} L ${d.x - 4.1} ${d.y + 3.1}`
                    )
                    .attr("class", "stick");
                d3.select(this)
                    .append("path")
                    .attr(
                        "d",
                        `M ${d.x - 4} ${d.y + 3} L ${d.x - 5.5} ${d.y + 2.85} `
                    )
                    .attr("class", "stick-head");
                d3.select(this)
                    .append("circle")
                    .attr("cx", d.x - 4.5)
                    .attr("cy", d.y + 2)
                    .attr("r", 0.5)
                    .attr("class", "puck");
            }
        });

    interact("." + color + "-dot").draggable({
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: d3.select("#background").node(),
                elementRect: { left: 0.5, top: 0.5, bottom: 0.5, right: 0.6 }
                // endOnly: true
            })
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
                d3.select(event.target).attr(
                    "transform",
                    `translate(${x}, ${y})`
                );
            }
        }
    });
}

function setUpButtons() {
    const buttons = [
        { id: "metric1", label: "Metric 1" },
        { id: "metric2", label: "Metric 2" },
        { id: "metric3", label: "Metric 3" }
    ];

    d3.select("#custom-bar")
        .append("div")
        .attr("id", "buttons")
        .selectAll("button")
        .data(buttons)
        .enter()
        .append("button")
        .text((d) => d.label)
        .attr("id", (d) => d.id)
        .on("click", function () {
            metric = d3.select(this).attr("id");
            d3.select("#buttons")
                .selectAll("button")
                .classed("selected", function (d, i) {
                    return metric == d3.select(this).attr("id");
                });
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
                    y: 0
                }))
            };
            setUpPointSet(all_points[color].original, color);
        });

        setUpPointSet(_.slice(points, 0, color === "blue" ? 5 : 6), color);
    }
    setUpButtons();
}
