const root = d3.select("#ice-hockey-svg");
let rootMatrix;

// BLUE = offense
// ORANGE = defense

let bluePoints = [
    { x: -40, y: 17.5, id: "O1" },
    { x: -40, y: -17.5, id: "O2" },
    { x: -40, y: 0, id: "O3" },
    { x: -75, y: 12.5, id: "O4" },
    { x: -75, y: -12.5, id: "O5" },
    { x: -30, y: 0, id: "O6" }
];

let orangePoints = [
    { x: -85, y: 0, id: "DG" },
    { x: -55, y: 10, id: "D1" },
    { x: -55, y: -10, id: "D2" },
    { x: -55, y: 0, id: "D3" },
    { x: -70, y: 5.5, id: "D4" },
    { x: -70, y: -5.5, id: "D5" },
    { x: -55, y: 0, id: "D6" }
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
        (o) => o.id !== "DG"
    );
}

function changePuckCarrier(dataId) {
    d3.select("#puck-stick").remove();
    const dot = d3
        .select("#ice-hockey-svg")
        .select("#blue")
        .select("#dots")
        .select(`g[data-id="${dataId}"]`);

    const puckstick = dot.append("g").attr("id", "puck-stick");
    const x = parseFloat(dot.select("circle").attr("cx"));
    const y = parseFloat(dot.select("circle").attr("cy"));
    puckstick
        .append("path")
        .attr("d", `M ${x - 3} ${y} L ${x - 4.1} ${y + 3.1}`)
        .attr("class", "stick");
    puckstick
        .append("path")
        .attr("d", `M ${x - 4} ${y + 3} L ${x - 5.5} ${y + 2.85} `)
        .attr("class", "stick-head");
    puckstick
        .append("circle")
        .attr("cx", x - 4.5)
        .attr("cy", y + 2)
        .attr("r", 0.5)
        .attr("class", "puck");
}

function getPuckCarrier() {
    // https://stackoverflow.com/a/43769625
    return d3
        .select("#puck-stick")
        .select(function () {
            return this.parentNode;
        })
        .attr("data-id");
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

    let dots = colorG
        .append("g")
        .attr("id", "dots")
        .selectAll("dot")
        .data(points)
        .join("g")
        .attr("class", color + "-dot")
        .attr("data-id", (d) => d.id)
        .on("mouseup", function (e) {
            if (e.shiftKey && color == "blue") {
                changePuckCarrier(d3.select(this).attr("data-id"));
            }
            run_model();
        })
        .on("touchend", function (e) {
            run_model();
        })
        // .on("dblclick", function () {
        //     if (color == "blue") {
        //         changePuckCarrier(d3.select(this).attr("data-id"));
        //     }
        // })
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
                .attr("class", "dot-text large")
                .text(d.id);

            if (d.id === "DG") {
                let cx = d.x;
                let cy = d.y;
                d3.select(this)
                    .text("")
                    .attr("class", "goalie-dot")
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

    if (color == "orange") {
        interact(".goalie-dot").draggable({
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: d3.select("#goalie-bubble").node(),
                    elementRect: {
                        left: 0.5,
                        top: 0.5,
                        bottom: 0.5,
                        right: 0.6
                    }
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
                        if (
                            point.id === d3.select(event.target).attr("data-id")
                        ) {
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

    changePuckCarrier("O1");
}

function setUpButtons() {
    const buttons = [
        { id: "metric0", label: "Rink Control" },
        { id: "metric1", label: "Successful Pass Probability" },
        { id: "metric2", label: "Best Case Pass Value" },
        { id: "metric3", label: "Expected Pass Value" }
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
        .attr("class", (d) => (d.id == "metric0" ? "selected" : undefined))
        .on("click", function () {
            metric = d3.select(this).attr("id");
            d3.select("#buttons")
                .selectAll("button")
                .classed("selected", function (d, i) {
                    return metric == d3.select(this).attr("id");
                });
            run_model();
        });
}

function run_model() {
    // x_js = [
    //     28.5738, 44.3415, 46.2854, 49.4131, 43.6537, 20.1617, 19.1869,
    //     13.3854, 20.0018
    // ];
    // y_js = [
    //     49.31514, 48.25991, 70.17542, 13.65429, 28.5197, 38.44596,
    //     36.80571, 38.32781, 22.03946
    // ];
    // vx_js = [
    //     6.725073, 4.964445, -3.097599, 14.252625, 4.286796, 1.925091,
    //     -2.295729, -0.294258, 6.464229
    // ];
    // vy_js = [
    //     -7.1037417, -7.967796, -6.4446342, 6.5618985, -10.9455216,
    //     -4.7444208, -4.1465373, -0.3377985, -5.4265284
    // ];
    // goalie_js = 7;
    // puck_js = 3;
    // off_js = [-1, -1, 1, 1, -1, 1, -1, -1, 1];
    overall = [
        ...shiftedPoints(all_points["blue"]),
        ...shiftedPoints(all_points["orange"])
    ];
    ids = _.map(overall, "id");
    x_js = _.map(overall, "x");
    y_js = _.map(overall, "y");
    vx_js = _.map(overall, () => 0.01);
    vy_js = _.map(overall, () => 0.01);
    goalie_js = _.findIndex(ids, (id) => id == "DG");
    puck_js = _.findIndex(ids, (id) => id == getPuckCarrier());
    off_js = _.map(ids, (id) => (id.slice(0, 1) == "O" ? 1 : -1));

    tracks = pyodide.globals.get("tracks");
    results = tracks(x_js, y_js, vx_js, vy_js, goalie_js, puck_js, off_js);
    plot_metric(results.grid.toJs(), results.domains.toJs());
    results.destroy();
}

function plot_metric(grid, domains) {
    const METRIC = parseInt(d3.select(".selected").attr("id").slice(-1)) + 3;

    METRIC == 3
        ? changeLegendText("OFFEN(S/C)E", "DEFEN(S/C)E")
        : changeLegendText("LOW", "HIGH");

    const colorPalette = d3
        .scaleSequential()
        .domain(domains[METRIC])
        .interpolator(d3.interpolateRdBu);
    d3.select("#transformations").select("#overlay").selectAll("*").remove();

    d3.select("#transformations")
        .select("#overlay")
        .selectAll("circle")
        .data(grid)
        .enter()
        .append("circle")
        .attr("r", "1")
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1])
        .attr("fill", (d) => colorPalette(d[METRIC]));
}

function setupLegend() {
    const legendBox = d3.select("#legend-wrapper");

    legendBox
        .append("span")
        .text("OFFEN(S/C)E ")
        .attr("class", "legend-text")
        .attr("id", "legend-text-left");

    const NUM = 50;
    const colorPalette = d3
        .scaleSequential()
        .domain([0, NUM - 1])
        .interpolator(d3.interpolateRdBu);

    const values = Array(NUM)
        .fill()
        .map((x, i) => i);
    legendBox
        .selectAll("div")
        .data(values)
        .enter()
        .append("span")
        .attr("class", "legend-slice")
        .style("background-color", (d) => colorPalette(d));

    legendBox
        .append("span")
        .text(" DEFEN(S/C)E")
        .attr("class", "legend-text")
        .attr("id", "legend-text-right");
}

function changeLegendText(left_text, right_text) {
    d3.select("#legend-text-left").text(" " + left_text + " ");
    d3.select("#legend-text-right").text(" " + right_text + " ");
}

function setup() {
    let overallG = d3
        .select("#transformations")
        .attr("clip-path", "url(#clipBorder)")
        .append("g")
        .attr("id", "overlay")
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
            .text(color === "blue" ? "Offen(s/c)e" : "Defen(s/c)e");

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
    setupLegend();
}

setup();
