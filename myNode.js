class MyNode {
    constructor(parent, allPath, name) {
        const self = this;
        const node = parent.group();
        node.rect(200, 200).attr({ "fill": "#fff", "fill-opacity": 0.7, "stroke-width": 2, "stroke": "#000", "rx": 15 });
        node.draggable();
        const text = node.text(name);
        text.move(80, 10);

        self.node = node;
        self.text = text;
        self.connections = [];
        self.inputs = [];
        self.outputs = [];
        self.allPath = allPath;

        self.canDrag = true;

        node.on("beforedrag", function (e) {
            if (!self.canDrag) {
                e.preventDefault();
            }
        });
        node.on("dragmove", function () {
            node.front();
            self.connections.forEach(function (connection) {
                const pathSvg = self.allPath.get(connection.id);
                pathSvg.plot("M " + connection.output.cx() + " " + connection.output.cy() + " L " + connection.input.cx() + " " + connection.input.cy());
            });
        });
    }

    addSocket(type, flow) {
        const self = this;
        var color = "#fff";
        if (type === "exec") {
            color = "#d64c11";
        } else if (type === "int") {
            color = "#32cd32";
        }
        var socketX = -10;
        var socketY = 20;
        if (flow === "out") {
            socketX = 190;
            socketY += 40 * this.outputs.length;
        } else {
            socketY += 40 * this.inputs.length;
        }

        const socket = this.node.group();
        const rect = socket.rect(20, 20).attr({ "fill": color });
        const polygon = socket.polygon("20,0 30,10 20,20");
        polygon.fill(color).move(20, 0);

        socket.move(socketX, socketY);
        if (flow === "out") {
            this.outputs.push({
                svg: socket,
                type
            });
        } else {
            this.inputs.push({
                svg: socket,
                type
            });
        }

        socket.on("mouseenter", function () {
            console.log("I am in!");
            self.canDrag = false;
            rect.fill("#0000ff");
            polygon.fill("#0000ff");
            socket.css("cursor", "pointer");
        });
        socket.on("mouseleave", function () {
            console.log("I am out!");
            self.canDrag = true;
            rect.fill(color);
            polygon.fill(color);
            socket.css("cursor", null);
        });
        return socket;
    }

    addConnection(id, output, input) {
        this.connections.push({ id, output, input });
    }
}