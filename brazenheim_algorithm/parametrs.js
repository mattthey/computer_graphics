// регистрируем функции
window.sin = Math.sin;
window.cos = Math.cos;
window.tan = Math.tan;
window.cot = function(x) { return 1 / Math.tan(x) };
window.sqrt = Math.sqrt;
window.pow = Math.pow;

// регистрируем константы
window.pi = Math.PI;
window.e = Math.E;

// используемые функции
const POSSIBLE_TOKENS = [
    'sin', 'cos', 'tan', 'cot', 'sqrt', 'log', 'pow'
];
// используемые константы
const CONSTANTS = ['pi', 'e']

// регулярка для поиска всех токенов из функции
const REG_TOKKEN = /\b[^\d\W]+\b/g

/**
 * Добавить парамаетр
 */
function addParametrs() {
    let formFunctionWithParam = document.getElementById('functionParameters')
    // добавляем комментарий, если 
    addCommentBeforeParamsIfNecessary(formFunctionWithParam)

    // создаем перенос строки в единственном экземпляре
    const br = document.createElement('br')

    const idForAddingAttribute = 'functionParameters-' + Math.random().toString(36);

    // создаем элемент для передачи названия параметра
    const addParam = document.createElement('input')
    addParam.setAttribute('type', 'text')
    addParam.setAttribute('id', idForAddingAttribute)
    
    // создаем кнопку для удаления параметра
    const buttonForDeleteParam = document.createElement('button')
    buttonForDeleteParam.setAttribute('onclick', `deleteParametrsField('${idForAddingAttribute}', this)`)
    buttonForDeleteParam.setAttribute('type', 'button')
    buttonForDeleteParam.setAttribute('id', idForAddingAttribute + '-btn')
    buttonForDeleteParam.innerText = 'Удалить параметр'

    formFunctionWithParam.appendChild(br)
    formFunctionWithParam.appendChild(addParam)
    formFunctionWithParam.appendChild(buttonForDeleteParam)
}

/**
 * Функция для добавления первого параметра, если это необходимо
 */
function addCommentBeforeParamsIfNecessary(formFunctionWithParam) {
    if (formFunctionWithParam.childElementCount <= 0) {
        
        // создаем перенос строки в единственном экземпляре
        const br = document.createElement('br')
        formFunctionWithParam.appendChild(br)

        // создаем комментарий
        const comment = document.createTextNode('Add parametrs as key=value, example t=12')
        formFunctionWithParam.appendChild(comment)
    }
}

function deleteParametrsField(idxForDelete, button) {
    console.log(`delete element with idx = ${idxForDelete}`)
    let formFunctionWithParam = document.getElementById('functionParameters')
    let removedElement = document.getElementById(idxForDelete)
    formFunctionWithParam.removeChild(removedElement)

    // удаляем и кнопку
    formFunctionWithParam.removeChild(button)
}

/**
 * Получить ассоциативный массив имя параметра => его значение
 */
 function getFunctionParams() {
    const result = new Map();
    const formFunctionWithParam = document.getElementById('functionParameters')
    const functionParams = formFunctionWithParam.getElementsByTagName('input')
    
    for (const param of functionParams) {
        const paramValue = param.value;
        const afterSplit = paramValue.split('=')
        // проверяем, что разбиение по токену есть
        if (afterSplit.length != 2) {
            const msg = 'Поле с параметром "' + paramValue + '" не содержит символа "="'
            alert(msg)
            throw msg
        }
        // проверяем, что значение - это число
        if (isNaN(afterSplit[1])) {
            const msg = 'Параметр с ключом "' + afterSplit[0] + '" в качестве значения должен содержать число'
            alert(msg)
            throw msg
        }
        result.set(afterSplit[0], afterSplit[1])
    }
    return result;
}

/**
 * Функция, печатающая финальную функцию, после подстановки всех параметров
 */
function printResult() {
    const functionCode = document.getElementById('function-code').value.trim()
    // проверяем, что функция не пустая
    if (functionCode == '') {
        alert('Функция пустая')
        return
    }

    // получаем параметры
    const functionParams = getFunctionParams();

    // проверяем, что нет неизвестных токенов
    let tokens = functionCode.matchAll(REG_TOKKEN)
    for (const token of tokens) {
        let t = token[0]
        if (t !== 'x' && !POSSIBLE_TOKENS.includes(t) && !CONSTANTS.includes(t)) {
            if (!functionParams.has(t)) {
                alert('неизвестный токен ' + t)
                return
            }
        }
    }

    // строим функцию
    let functionCodeJs = 'var F = function(x) { '
    functionParams.forEach((value, key) => {
        functionCodeJs += ` let ${key} = ${value}; `
    });
    functionCodeJs += ' return ' + functionCode + '; }';
    console.log(functionCodeJs)

    // alert(functionCodeJs)
    Draw(functionCodeJs)
}