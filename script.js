// Получаем элементы DOM
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const resultInput = document.getElementById('result');
const rateText = document.getElementById('rate-text');
const swapBtn = document.getElementById('swap-btn');
const fromFlag = document.getElementById('from-flag');
const toFlag = document.getElementById('to-flag');

// Функция обновления флага
function updateFlag(element, currencyCode) {
    // Берем первые 2 буквы валюты как код страны
    let countryCode = currencyCode.slice(0, 2);
    
    // Ручная корректировка для валют, где код страны не совпадает с первыми буквами
    if (currencyCode === 'EUR') countryCode = 'EU';
    if (currencyCode === 'GBP') countryCode = 'GB';
    if (currencyCode === 'CNY') countryCode = 'CN';
    if (currencyCode === 'KGS') countryCode = 'KG';
    if (currencyCode === 'KZT') countryCode = 'KZ';
    // Для USD и большинства других валют работает slice(0,2) автоматически

    element.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Главная функция конвертации
async function getExchangeRate() {
    const amount = amountInput.value || 1; // Если поле пустое, считаем 1
    const fromVal = fromCurrency.value;
    const toVal = toCurrency.value;

    rateText.innerText = "Getting exchange rate...";
    
    try {
        // Используем бесплатный API
        const url = `https://api.exchangerate-api.com/v4/latest/${fromVal}`;
        const response = await fetch(url);
        const data = await response.json();
        
        const rate = data.rates[toVal];
        const total = (amount * rate).toFixed(2); // Округляем до 2 знаков

        resultInput.value = total;
        
        // Обновляем текст курса
        rateText.innerText = `1 ${fromVal} = ${rate} ${toVal}`;
    } catch (error) {
        rateText.innerText = "Error getting rates";
        console.error(error);
    }
}

// Слушатели событий (Events)

// Запуск при загрузке страницы
window.addEventListener('load', () => {
    getExchangeRate();
});

// При вводе суммы
amountInput.addEventListener('input', getExchangeRate);

// При смене первой валюты
fromCurrency.addEventListener('change', (e) => {
    updateFlag(fromFlag, e.target.value);
    getExchangeRate();
});

// При смене второй валюты
toCurrency.addEventListener('change', (e) => {
    updateFlag(toFlag, e.target.value);
    getExchangeRate();
});

// Кнопка Swap (поменять местами)
swapBtn.addEventListener('click', () => {
    const tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;

    // Обновляем флаги
    updateFlag(fromFlag, fromCurrency.value);
    updateFlag(toFlag, toCurrency.value);

    // Пересчитываем
    getExchangeRate();
});