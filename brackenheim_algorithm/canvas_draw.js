// иницализация для canvas
const XSTEP = 0.001;

const Canvas = document.getElementById('xy-graph');
var Ctx = Canvas.getContext('2d');

const Width = Canvas.width;
const Height = Canvas.height;

// Правая граница по x
const MAX_X = 10;
// Левая граница по x
const MIN_X = -10;
// Верхняя граница по y
const MAX_Y = 10;
// Нижняя граница по y
const MIN_Y = -10;

const MAX_X_CORD = (MAX_X - MIN_X) / (MAX_X - MIN_X) * Width;
const MIN_X_CORD = (MIN_X - MIN_X) / (MAX_X - MIN_X) * Width;

const MAX_Y_CORD = Height - (MAX_Y - MIN_Y) / (MAX_Y - MIN_Y) * Height;
const MIN_Y_CORD = Height - (MIN_Y - MIN_Y) / (MAX_Y - MIN_Y) * Height;

// random color
function getColorCode() {
    var makeColorCode = '0123456789ABCDEF';
    var code = '#';
    for (var count = 0; count < 6; count++) {
        code =code+ makeColorCode[Math.floor(Math.random() * 16)];
    }
    return code;
}

function reverseXC(x) {
    return (x / Width * (MAX_X - MIN_X)) + MIN_X;
}

// Возвращает физическую координату x от логической координаты x:
function XC(x) {
    return (x - MIN_X) / (MAX_X - MIN_X) * Width;
}

// Возвращает физическую координату y от логической координаты y:
function YC(y) {
    return Height - (y - MIN_Y) / (MAX_Y - MIN_Y) * Height;
}

/**
 * Очистить доску canvas и нарисовать новый график
 * 
 * @param functionParams ассоциативный массив с параметрами функции
 */
function Draw(functionParams) {
    Ctx.strokeStyle = 'black'
    Ctx.clearRect(0, 0, Width, Height);

    // Рисуем
    DrawAxes();

    Ctx.lineWidth = 2;
    Ctx.strokeStyle = 'red'

    RenderFunction(functionParams);
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
    Ctx.lineTo(XC(0), YC(MAX_Y));
    Ctx.stroke();

    // -Y axis
    Ctx.beginPath();
    Ctx.moveTo(XC(0), YC(0));
    Ctx.lineTo(XC(0), YC(MIN_Y));
    Ctx.stroke();

    // Y axis от 0 до максимума
    let deltY = YTickDelta();
    for (var i = 1; (i * deltY) < MAX_Y; ++i) { 
        Ctx.beginPath();
        Ctx.moveTo(XC(0) - 5, YC(i * deltY));
        Ctx.lineTo(XC(0) + 5, YC(i * deltY));
        // пишем текстом координату y
        Ctx.fillText(i, XC(0) + 10, YC(i * deltY));
        Ctx.stroke();
    }

    // Y axis от минимума до 0
    for (var i = 1; (i * deltY) > MIN_Y; --i) {
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
    Ctx.lineTo(XC(MAX_X), YC(0));
    Ctx.stroke();

    // -X axis
    Ctx.beginPath();
    Ctx.moveTo(XC(0), YC(0));
    Ctx.lineTo(XC(MIN_X), YC(0));
    Ctx.stroke();

    // X tick marks
    let deltaX = XTickDelta();
    for (var i = 1; (i * deltaX) < MAX_X; ++i) {
        Ctx.beginPath();
        Ctx.moveTo(XC(i * deltaX), YC(0) - 5);
        Ctx.lineTo(XC(i * deltaX), YC(0) + 5);
        // пишем текстом координату y
        Ctx.fillText(i, XC(i * deltaX), YC(0) + 10);
        Ctx.stroke();
    }

    for (var i = 1; (i * deltaX) > MIN_X; --i) {
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

/**
 * Находим откуда надо шагать
 */
function findFromT(a, b, c, d) {
    // t с минимальным x
    const tWithMinX = (a / MIN_X) - b;
    const tWithMaxX = (a / MAX_X) - b;
    
    const tWithMinY = (MIN_Y - d) / c;
    const tWithMaxY = (MAX_Y - d) / c;

    const val = Math.min(tWithMinX, tWithMaxX, tWithMinY, tWithMaxY);
    if (val === 0) return val;
    if (val < 0) return Math.floor(val);
    if (val > 0) return Math.ceil(val);
}

function findToT(a, b, c, d) {
    // t с минимальным x
    const tWithMinX = (a / MIN_X) - b;
    const tWithMaxX = (a / MAX_X) - b;
    
    const tWithMinY = (MIN_Y - d) / c;
    const tWithMaxY = (MAX_Y - d) / c;

    const val = Math.max(tWithMinX, tWithMaxX, tWithMinY, tWithMaxY);
    if (val === 0) return val;
    if (val < 0) return Math.floor(val);
    if (val > 0) return Math.ceil(val);
}


// RenderFunction(f) renders the input funtion f on the canvas.
function RenderFunction(params) {
    const a = params.get('a');
    const b = params.get('b');
    const c = params.get('c');
    const d = params.get('d');

    let toInf = true;
    let toNegInf = true;

    let prevX = ((c * (a + 10 * b))/-10) + d
    let prevY = 101;

    Ctx.beginPath();
    for (let coordX = 0; coordX <= Width; coordX += 1)
    {
        const x = reverseXC(coordX);
        const y = ((c * (a - x * b)) / x) + d;

        if (y === Infinity && Math.abs(prevY) >= 10) {
            Ctx.lineTo(coordX, MIN_Y_CORD);
            Ctx.moveTo(XC(0), MAX_Y_CORD);
            const xx = reverseXC(coordX + 2);
            Ctx.lineTo(coordX + 2, YC(((c * (a - xx * b)) / xx) + d));
        } else if (y === -Infinity && Math.abs(prevY) >= 10) {
            Ctx.lineTo(coordX, MAX_Y_CORD);
            Ctx.moveTo(XC(0), MIN_Y_CORD);
            const xx = reverseXC(coordX + 2);
            Ctx.lineTo(coordX + 2, YC(((c * (a - xx * b)) / xx) + d));
        }
        if (prevX !== 0 && (prevX >= 0 && x >= 0) || (prevX <= 0 && x <= 0)) {
            Ctx.lineTo(coordX, YC(y));
        } else {
            Ctx.moveTo(coordX, YC(y));
        }
        console.log(`prev (${y},${x}); coordX=${coordX};  (${x}; ${y})`)
        prevX = x;
        prevY = YC(y);
    }
    // for (let x = -10; x <= 10; x += XSTEP)
    // {
    //     const y = ((c * (a - x * b)) / x) + d;

    //     if ((prevX >= 0 && x >= 0) || (prevX <= 0 && x <= 0)) {
    //         Ctx.lineTo(XC(x), YC(y));
    //     } else {
    //         Ctx.moveTo(XC(x), YC(y));
    //     }
    //     prevX = x;
    // }
    Ctx.stroke();
}