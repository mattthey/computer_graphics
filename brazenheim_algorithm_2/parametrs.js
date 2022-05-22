/**
 * Получить ассоциативный массив имя параметра => его значение
 */
 function getFunctionParams() {
    const result = new Map();
    const formFunctionWithParam = document.getElementById('parametrs')
    const functionParams = formFunctionWithParam.getElementsByTagName('input')
    
    for (const param of functionParams) {
        const paramValue = param.value.trim();
        if (paramValue.length == 0) {
            const msg = `Не заполнено поле ${param.id}`
            alert(msg)
            throw msg
        }
        result.set(param.id, parseFloat(paramValue))
    }
    return result;
}

/**
 * Функция, печатающая финальную функцию, после подстановки всех параметров
 */
function printResult() {

    // получаем параметры
    const functionParams = getFunctionParams();
    // alert(functionCodeJs)
    Draw(functionParams)
}