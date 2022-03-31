let originalPoints = [
    [-40, 25],
    [-40, -25],
    [-40, 0],
    [-70, 12.5],
    [-70, -12.5],
];

originalPoints = originalPoints.concat(
    originalPoints.map(([x, y]) => [x * -1, y])
);

function dragMoveListener(event) {
    var target = event.target;
    const coords = d3.pointer(event);
    // keep the dragged position in the data-x/data-y attributes
    console.log(event.dx);
    var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // translate the element
    target.style.transform = "translate(" + x + ", " + y + ")";
}

export function setup() {
    function coordTransform([x, y]) {
        return [x + 100, 42.5 - y];
    }

    let dots = d3
        .select("#transformations")
        .attr("clip-path", "url(#clipBorder)")
        .append("g")
        .attr("id", "dots")
        .selectAll("dot")
        .data(originalPoints.map(coordTransform))
        .join("circle")
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1])
        .attr("r", 3)
        .style("fill", "blue")
        .attr("class", "dot");

    interact(".dot").draggable({
        inertia: false,
        autoScroll: false,
        listeners: {
            // call this function on every dragmove event
            move: dragMoveListener,
        },
    });
}
