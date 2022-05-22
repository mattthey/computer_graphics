// иницализация для canvas
const XSTEP = 0.005;

var Canvas = document.getElementById('xy-graph');
var Ctx = null;

var Width = Canvas.width;
var Height = Canvas.height;

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

/**
 * Очистить доску canvas и нарисовать новый график
 * 
 * @param functionParams ассоциативный массив с параметрами функции
 */
function Draw(functionParams) {
    if (Canvas.getContext) {

        Width = parseInt(document.getElementById('width').value)
        Height = parseInt(document.getElementById('height').value)

        Canvas.setAttribute('width', Width)
        Canvas.setAttribute('height', Height)

        Ctx = Canvas.getContext('2d');
        Ctx.clearRect(0, 0, Width, Height);

        // Рисуем
        DrawAxes();

        Ctx.lineWidth = 2;
        Ctx.strokeStyle = 'red'

        RenderFunction(functionParams);

    } else {
    }
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
        Ctx.moveTo(XC(i * deltaX), YC(0) -  5);
        Ctx.lineTo(XC(i * deltaX), YC(0) + 5);
        if (i != 0) {
            // пишем текстом координату y
            Ctx.fillText(i, XC(i * deltaX), YC(0) + 15);
        }
        Ctx.stroke();
    }
    Ctx.restore();
}


// RenderFunction(f) renders the input funtion f on the canvas.
function RenderFunction(params) {
    const a = params.get('a');
    const b = params.get('b');
    const c = params.get('c');
    const d = params.get('d');

    const fromT = params.get('from-t');
    const toT = params.get('to-t');

    let prevX = - (a / (fromT + b));

    Ctx.beginPath();
    for (var tt = fromT; tt <= toT; tt += XSTEP)
    {
        const x = a / (tt + b);
        const y = c * tt + d

        console.info(`t=${tt}; x=${x}; y=${y}`)
        
        if ((prevX >= 0 && x >= 0) || (prevX <= 0 && x <= 0)) {
            Ctx.lineTo(XC(x), YC(y));
        } else {
            Ctx.moveTo(XC(x), YC(y));
        }
        prevX = x;
    }
    Ctx.stroke();
}