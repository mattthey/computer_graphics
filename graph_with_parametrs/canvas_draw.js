// иницализация для canvas
var Canvas = document.getElementById('xy-graph');
var Ctx = null;

var Width = Canvas.width;
var Height = Canvas.height;

var MAX_Y = null
var MIN_Y = null
var FF = null;

// Правая граница по x (задается на форме):
function MaxX() {
    return parseFloat(document.getElementById('maxX').value);
}

// Левая граница по x (задается на форме):
function MinX() {
    return parseFloat(document.getElementById('minX').value);ё
}

// Верхняя граница по y (вычисляется):
function MaxY() {
    // TODO оптимизировать вычисление верхней границы и нижней (точек экстремума)
    if (MAX_Y != null) {
        return MAX_Y
    }
    var XSTEP = (MaxX() - MinX()) / Width;
    for (var x = MinX(); x <= MaxX(); x += XSTEP) {
        var y = FF(x);
        if (y > MAX_Y || MAX_Y == null) {
            MAX_Y = y;
        }
    }
    MAX_Y += (XSTEP * 2)
    return MAX_Y;
}

// Нижняя граница по y (вычисляется):
function MinY() {
    // TODO оптимизировать вычисление верхней границы и нижней (точек экстремума)
    if (MIN_Y != null) {
        return MIN_Y
    }
    var XSTEP = (MaxX() - MinX()) / Width;
    for (var x = MinX(); x <= MaxX(); x += XSTEP) {
        var y = FF(x);
        if (y < MIN_Y || MIN_Y == null) {
            MIN_Y = y;
        }
    }
    MIN_Y -= (XSTEP * 2) 
    return MIN_Y;
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
 * @param functionCode
 */
function Draw(functionCode) {

    // Преобразуем сформированный код, обязательно переменная должна называться F
    eval(functionCode);

    if (Canvas.getContext) {
        MAX_Y = null
        MIN_Y = null
        FF = F

        Width = parseInt(document.getElementById('width').value)
        Height = parseInt(document.getElementById('height').value)

        Canvas.setAttribute('width', Width)
        Canvas.setAttribute('height', Height)

        Ctx = Canvas.getContext('2d');
        Ctx.clearRect(0, 0, Width, Height);

        // Рисуем
        DrawAxes();

        // Ctx.lineWidth = 1;
        Ctx.strokeStyle = 'red'

        RenderFunction(F);

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
 * Рендерим функцию f и выводим результат на доску canvas
 * 
 * @param {*} f 
 */
function RenderFunction(f) {
    var first = true;

    var XSTEP = (MaxX() - MinX()) / Width;

    Ctx.beginPath();
    for (var x = MinX(); x <= MaxX(); x += XSTEP) {
        var y = f(x);
        console.log(x, y)
        if (first)
        {
            Ctx.moveTo(XC(x), YC(y));
            first = false;
        }
        else
        {
            Ctx.lineTo(XC(x), YC(y));
        }
    }
    Ctx.stroke();
}