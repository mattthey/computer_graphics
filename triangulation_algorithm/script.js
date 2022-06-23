var Canvas = document.getElementById('xy-graph');
var Ctx = null;

var Width = Canvas.width;
var Height = Canvas.height;

/**
 * Проверка является ли аргумент числом
 */
function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

// Правая граница по x (задается на форме):
function MaxX() {
    return parseInt(document.getElementById('maxX').value);
}

// Левая граница по x (задается на форме):
function MinX() {
    return parseInt(document.getElementById('minX').value);
}

// Верхняя граница по y (вычисляется):
function MaxY() {
    return MaxX() * Height / Width;
}

// Нижняя граница по y (вычисляется):
function MinY() {
    return MinX() * Height / Width;
}

// Возвращает физическую координату x от логической координаты x:
function XC(x) {
    return (x - MinX()) / (MaxX() - MinX()) * Width;
}

// Возвращает физическую координату y от логической координаты y:
function YC(y) {
    return Height - (y - MinY()) / (MaxY() - MinY()) * Height;
}

function getRandomColour() {
    var red = Math.floor(Math.random() * 255);
    var green = Math.floor(Math.random() * 255);
    var blue = Math.floor(Math.random() * 255);

    return "rgb(" + red + "," + green + "," + blue + " )";
}

function editCanvasSize() {
    const newWidth = parseInt(document.getElementById('width').value)
    const newHeight = parseInt(document.getElementById('height').value)
    Canvas.setAttribute('width', newWidth)
    Canvas.setAttribute('height', newHeight)
}


// Возвращает расстояние между делениями по оси X:
function XTickDelta() {
    return 1;
}

// Возвращает расстояние между делениями по оси Y:
function YTickDelta() {
    return 1;
}

/**
 * Рисование осей X и Y с делениями
 */
function DrawAxes() {
    Ctx.save();
    Ctx.lineWidth = 1;

    // +Y axis
    Ctx.beginPath();
    Ctx.moveTo(XC(0), YC(0));
    Ctx.lineTo(XC(0), YC(MaxY()));
    Ctx.stroke();

    // -Y axis
    Ctx.beginPath();
    Ctx.moveTo(XC(0), YC(0));
    Ctx.lineTo(XC(0), YC(MinY()));
    Ctx.stroke();

    // Y axis от 0 до максимума
    let deltY = YTickDelta();
    for (var i = 1; (i * deltY) < MaxY(); ++i) {
        Ctx.beginPath();
        Ctx.moveTo(XC(0) - 5, YC(i * deltY));
        Ctx.lineTo(XC(0) + 5, YC(i * deltY));
        // пишем текстом координату y
        Ctx.fillText(i, XC(0) + 10, YC(i * deltY));
        Ctx.stroke();
    }

    // Y axis от минимума до 0
    for (var i = 1; (i * deltY) > MinY(); --i) {
        Ctx.beginPath();
        Ctx.moveTo(XC(0) - 5, YC(i * deltY));
        Ctx.lineTo(XC(0) + 5, YC(i * deltY));
        // пишем текстом координату y
        Ctx.fillText(i, XC(0) + 10, YC(i * deltY));
        Ctx.stroke();
    }

    // +X axis
    Ctx.beginPath();
    Ctx.moveTo(XC(0), YC(0));
    Ctx.lineTo(XC(MaxX()), YC(0));
    Ctx.stroke();

    // -X axis
    Ctx.beginPath();
    Ctx.moveTo(XC(0), YC(0));
    Ctx.lineTo(XC(MinX()), YC(0));
    Ctx.stroke();

    // X tick marks
    let deltaX = XTickDelta();
    for (var i = 1; (i * deltaX) < MaxX(); ++i) {
        Ctx.beginPath();
        Ctx.moveTo(XC(i * deltaX), YC(0) - 5);
        Ctx.lineTo(XC(i * deltaX), YC(0) + 5);
        // пишем текстом координату y
        Ctx.fillText(i, XC(i * deltaX), YC(0) + 10);
        Ctx.stroke();
    }

    for (var i = 1; (i * deltaX) > MinX(); --i) {
        Ctx.beginPath();
        Ctx.moveTo(XC(i * deltaX), YC(0) - 5);
        Ctx.lineTo(XC(i * deltaX), YC(0) + 5);
        if (i != 0) {
            // пишем текстом координату y
            Ctx.fillText(i, XC(i * deltaX), YC(0) + 15);
        }
        Ctx.stroke();
    }
    Ctx.restore();
}

/**
 * Рисуем многоугольник
 */
function drawPolygon() {
    let cordsFromInp = document.getElementById('cords').value.split(',');
    if (cordsFromInp.length % 2 !== 0) {
        alert(`Неверное число аргументов, ожидалось колличество аргументов, кратное 3, получили ${cordsFromInp.length}`)
        return
    }

    const cords = []
    for (let i = 0; i < cordsFromInp.length; i++) {
        let cord = cordsFromInp[i]
        if (!isNumber(cord)) {
            alert(`Это не число ${cord}`)
            return
        }
        cords.push(parseFloat(cord))
    }

    let deltaX = XTickDelta();

    Ctx.beginPath();
    Ctx.moveTo(XC(cords[0]), YC(cords[1]))
    for (let i = 0; i < cords.length; i += 2) {
        let x = cords[i]
        let y = cords[i + 1]

        Ctx.lineTo(XC(x), YC(y));

        Ctx.fillText(i / 2, XC(x), YC(y) + 15);
    }
    Ctx.lineTo(XC(cords[0]), YC(cords[1]))
    Ctx.stroke();
}

/**
 * Проверить принадлежит ли точка многоугольнику
 */
function isLineInPolygone(p1, p2, xp, yp) {
    // 1. Убедиться, что отрезок не пересекается со сторонами многоугольника. => O(N)
    /**
     * 
        bool intersection(Point2f start1, Point2f end1, Point2f start2, Point2f end2, Point2f *out_intersection)
        {
            Point2f dir1 = end1 - start1;
            Point2f dir2 = end2 - start2;

            //считаем уравнения прямых проходящих через отрезки
            float a1 = -dir1.y;
            float b1 = +dir1.x;
            float d1 = -(a1*start1.x + b1*start1.y);

            float a2 = -dir2.y;
            float b2 = +dir2.x;
            float d2 = -(a2*start2.x + b2*start2.y);

            //подставляем концы отрезков, для выяснения в каких полуплоскотях они
            float seg1_line2_start = a2*start1.x + b2*start1.y + d2;
            float seg1_line2_end = a2*end1.x + b2*end1.y + d2;

            float seg2_line1_start = a1*start2.x + b1*start2.y + d1;
            float seg2_line1_end = a1*end2.x + b1*end2.y + d1;

            //если концы одного отрезка имеют один знак, значит он в одной полуплоскости и пересечения нет.
            if (seg1_line2_start * seg1_line2_end >= 0 || seg2_line1_start * seg2_line1_end >= 0) 
                return false;

            float u = seg1_line2_start / (seg1_line2_start - seg1_line2_end);
            *out_intersection =  start1 + u*dir1;

            return true;
        }
     **/

    // 2. Проверить, принадлежит ли точка на отрезке (например, его середина) многоугольнику. => O(N) 
    // let x = (x2 - x1) / 2;
    // let y = (y2 - y1) / 2;
    // let npol = xp.length;
    // let j = npol - 1;
    // let c = 0;
    // for (let i = 0; i < npol;i++){
    //     if (((yp[i] <= y && y < yp[j]) || (yp[j] <= y && y < yp[i])) && 
    //             x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])
    //     {
    //         c = !c
    //     }
    //     j = i;
    // }
    // return c;

    for (let i = 0; i < xp.length; i++) {
        let p3 = new Point(xp[i], yp[i])
        let p4 = (i == xp.length - 1) ? new Point(xp[0], yp[0]) : new Point(xp[i + 1], yp[i + 1])
        if (checkIntersectionOfTwoLineSegments(p1, p2, p3, p4)) {
            console.log(`Пересекается (${p1.x},${p1.y})-(${p2.x},${p2.y}) и (${p3.x},${p3.y})-(${p4.x},${p4.y})`)
            return false;
        }
    }
    return true
}

function drawTriangles3() {
    let cordsFromInp = document.getElementById('cords').value.split(',');
    const xp = []
    const yp = []
    for (let i = 0; i < cordsFromInp.length; i++) {
        let cord = cordsFromInp[i]
        if (!isNumber(cord)) {
            alert(`Это не число ${cord}`)
            return
        }
        coords.push(parseFloat(cord))
        if (i % 2 === 0) {
            xp.push(parseFloat(cord))
        } else {
            yp.push(parseFloat(cord))
        }
    }
}

/**
 * Рисуем триугольнки
 */
function drawTriangles() {
    let cordsFromInp = document.getElementById('cords').value.split(',');
    if (cordsFromInp.length % 2 !== 0) {
        alert(`Неверное число аргументов, ожидалось колличество аргументов, кратное 2, получили ${cordsFromInp.length}`)
        return
    }

    const coords = []
    const xp = []
    const yp = []
    for (let i = 0; i < cordsFromInp.length; i++) {
        let cord = cordsFromInp[i]
        if (!isNumber(cord)) {
            alert(`Это не число ${cord}`)
            return
        }
        coords.push(parseFloat(cord))
        if (i % 2 === 0) {
            xp.push(parseFloat(cord))
        } else {
            yp.push(parseFloat(cord))
        }
    }

    let d = new Delaunator(coords);
    let triangles = d.triangles
    for (let i = 0; i < triangles.length; i += 3) {
        Ctx.strokeStyle = getRandomColour();

        let a = triangles[i]
        let b = triangles[i + 1]
        let c = triangles[i + 2]

        Ctx.beginPath();
        let x = coords[a * 2];
        let y = coords[a * 2 + 1]
        Ctx.moveTo(XC(x), YC(y));

        let x2 = coords[b * 2];
        let y2 = coords[b * 2 + 1];

        // if (!isLineInPolygone( (x2 - x)/2, (y2 - y)/2, xp, yp)) {
        //     Ctx.stroke();
        //     continue
        // }

        Ctx.lineTo(XC(x2), YC(y2));

        let x3 = coords[c * 2];
        let y3 = coords[c * 2 + 1];

        // if (!isLineInPolygone( (x3 - x2)/2, (y3 - y2)/2, xp, yp)) {
        //     Ctx.stroke();
        //     continue
        // }

        Ctx.lineTo(XC(x3), YC(y3));

        let x4 = coords[a * 2];
        let y4 = coords[a * 2 + 1]

        // if (!isLineInPolygone( (x4 - x)/2, (y4 - y)/2, xp, yp)) {
        //     Ctx.stroke();
        //     continue
        // }


        Ctx.lineTo(XC(x4), YC(y4));

        Ctx.stroke();
    }
}

var globalTriangles = null;
var globalTrianglesIdx = null;
var global_coords = []
var global_xp = []
var global_yp = []

function polygon() {
    globalTriangles = null;
    globalTrianglesIdx = null;
    globalCoords = []
    global_xp = []
    global_yp = []

    if (Canvas.getContext) {
        Width = parseInt(document.getElementById('width').value)
        Height = parseInt(document.getElementById('height').value)

        Canvas.setAttribute('width', Width)
        Canvas.setAttribute('height', Height)

        Ctx = Canvas.getContext('2d');
        Ctx.clearRect(0, 0, Width, Height);

        // Рисуем axes
        DrawAxes();

        Ctx.lineWidth = 2;
        Ctx.strokeStyle = 'red'

        // рисуем многоугольнк
        drawPolygon()

        Ctx.strokeStyle = 'blue'
    }
}

function triangulation() {
    drawTriangles()
}

function triangulationStep() {
    if (globalTriangles == null) {
        let cordsFromInp = document.getElementById('cords').value.split(',');
        if (cordsFromInp.length % 2 !== 0) {
            alert(`Неверное число аргументов, ожидалось колличество аргументов, кратное 2, получили ${cordsFromInp.length}`)
            return
        }

        for (let i = 0; i < cordsFromInp.length; i++) {
            let cord = cordsFromInp[i]
            if (!isNumber(cord)) {
                alert(`Это не число ${cord}`)
                return
            }
            global_coords.push(parseFloat(cord))
            if (i % 2 === 0) {
                global_xp.push(parseFloat(cord))
            } else {
                global_yp.push(parseFloat(cord))
            }
        }

        let d = new Delaunator(global_coords);
        globalTriangles = d.triangles
        globalTrianglesIdx = 0;
    }

    if (globalTrianglesIdx >= globalTriangles.length) {
        alert("Всё нарисовали")
        return
    }

    let i = globalTrianglesIdx;

    Ctx.strokeStyle = getRandomColour();

    let a = globalTriangles[i]
    let b = globalTriangles[i + 1]
    let c = globalTriangles[i + 2]

    Ctx.beginPath();
    let x = global_coords[a * 2];
    let y = global_coords[a * 2 + 1]

    let x2 = global_coords[b * 2];
    let y2 = global_coords[b * 2 + 1];

    let x3 = global_coords[c * 2];
    let y3 = global_coords[c * 2 + 1];

    if (!isLineInPolygone(new Point(x, y), new Point(x2, y2), global_xp, global_yp)) {

        globalTrianglesIdx += 3;
        return
    }
    if (!isLineInPolygone(new Point(x2, y2), new Point(x3, y3), global_xp, global_yp)) {
        globalTrianglesIdx += 3;
        return
    }
    if (!isLineInPolygone(new Point(x3, y3), new Point(x, y), global_xp, global_yp)) {
        globalTrianglesIdx += 3;
        return
    }

    Ctx.moveTo(XC(x), YC(y));
    Ctx.lineTo(XC(x2), YC(y2));
    Ctx.lineTo(XC(x3), YC(y3));
    Ctx.lineTo(XC(x), YC(y));

    console.log(`a=${a} ; b=${b}; c=${c}`)

    Ctx.stroke();

    globalTrianglesIdx += 3;
}

/**
 * Печатаем результат
 */
function printResult() {
    if (Canvas.getContext) {
        Width = parseInt(document.getElementById('width').value)
        Height = parseInt(document.getElementById('height').value)

        Canvas.setAttribute('width', Width)
        Canvas.setAttribute('height', Height)

        Ctx = Canvas.getContext('2d');
        Ctx.clearRect(0, 0, Width, Height);

        // Рисуем axes
        DrawAxes();

        Ctx.lineWidth = 2;
        Ctx.strokeStyle = 'red'

        // рисуем многоугольнк
        drawPolygon()

        Ctx.strokeStyle = 'blue'

        //рисуем треугольники
        drawTriangles()
    }
}

//метод, проверяющий пересекаются ли 2 отрезка [p1, p2] и [p3, p4]
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function checkIntersectionOfTwoLineSegments(p1, p2, p3, p4) {

    //сначала расставим точки по порядку, т.е. чтобы было p1.x <= p2.x
    if (p2.x < p1.x) {
        let tmp = p1;
        p1 = p2;
        p2 = tmp;
    }

    //и p3.x <= p4.x

    if (p4.x < p3.x) {
        let tmp = p3;
        p3 = p4;
        p4 = tmp;
    }

    //проверим существование потенциального интервала для точки пересечения отрезков

    if (p2.x < p3.x) {
        return false; //ибо у отрезков нету взаимной абсциссы
    }

    //если оба отрезка вертикальные

    if ((p1.x - p2.x == 0) && (p3.x - p4.x == 0)) {
        //если они лежат на одном X
        if (p1.x == p3.x) {
            //проверим пересекаются ли они, т.е. есть ли у них общий Y
            //для этого возьмём отрицание от случая, когда они НЕ пересекаются
            if (!((Math.max(p1.y, p2.y) < Math.min(p3.y, p4.y)) || (Math.min(p1.y, p2.y) > Math.max(p3.y, p4.y)))) {
                return true;
            }
        }
        return false;

    }

    //найдём коэффициенты уравнений, содержащих отрезки
    //f1(x) = A1*x + b1 = y

    //f2(x) = A2*x + b2 = y

    //если первый отрезок вертикальный

    if (p1.x - p2.x == 0) {
        //найдём Xa, Ya - точки пересечения двух прямых
        let Xa = p1.x;
        let A2 = (p3.y - p4.y) / (p3.x - p4.x);
        let b2 = p3.y - A2 * p3.x;
        let Ya = A2 * Xa + b2;
        if (p3.x <= Xa && p4.x >= Xa && Math.min(p1.y, p2.y) <= Ya && Math.max(p1.y, p2.y) >= Ya) {
            return true;
        }
        return false;
    }

    //если второй отрезок вертикальный
    if (p3.x - p4.x == 0) {
        //найдём Xa, Ya - точки пересечения двух прямых
        let Xa = p3.x;
        let A1 = (p1.y - p2.y) / (p1.x - p2.x);
        let b1 = p1.y - A1 * p1.x;
        let Ya = A1 * Xa + b1;
        if (p1.x <= Xa && p2.x >= Xa && Math.min(p3.y, p4.y) <= Ya && Math.max(p3.y, p4.y) >= Ya) {
            return true;
        }
        return false;
    }

    //оба отрезка невертикальные

    let A1 = (p1.y - p2.y) / (p1.x - p2.x);
    let A2 = (p3.y - p4.y) / (p3.x - p4.x);
    let b1 = p1.y - A1 * p1.x;
    let b2 = p3.y - A2 * p3.x;
    if (A1 == A2) {
        return false; //отрезки параллельны
    }

    //Xa - абсцисса точки пересечения двух прямых
    let Xa = (b2 - b1) / (A1 - A2);
    Xa = Xa.toFixed(5)
    if ((Xa == p1.x && Xa == p3.x) || (Xa == p2.x && Xa == p3.x) || (Xa == p1.x && Xa == p4.x) || (Xa == p2.x && Xa == p4.x))
        return false;
    if (Xa < Math.max(p1.x, p3.x) || Xa > Math.min(p2.x, p4.x)) {
        return false; //точка Xa находится вне пересечения проекций отрезков на ось X
    }
    else {
        return true;
    }

}