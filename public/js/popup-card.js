var CARD_INFO = "cardInfo";

var todayTime = new Date().getTime();

function getTodayDate() {
    var getYear = new Date().getFullYear();
    var getMonth = new Date().getMonth() + 1;
    var getDay = new Date().getDate();
    return getYear + '/' + getMonth + '/' + getDay;
}

var date = getTodayDate();

const startDate = new Date('2021/12/20').getTime();
const endDate = new Date('2022/01/08').getTime()

var cardInfo = {
    open: false,
    close: false,
    today: null
}

function getStorageItem(key) {
    return localStorage.getItem(key);
}

function setStorageItem(obj) {
    localStorage.setItem(CARD_INFO, JSON.stringify(obj));
}

function deleteStorageItem(key) {
    getStorageItem(key) !== null && localStorage.removeItem(key);
}

function getStorageObject(key) {
    return getStorageItem(key) !== null && JSON.parse(localStorage.getItem(key));
}

function isDateInRange() {
    return (todayTime >= startDate && todayTime <= endDate);
}

function updateCardInfo(obj, oldObj) {
    return $.extend(obj, oldObj);
}

function showTemplate() {
    getStorageObject(CARD_INFO).open && $('#popupCard').modal('show');
    $('body').css('padding-right', '0px');
}

if (isDateInRange()) {
    if (getStorageItem(CARD_INFO) !== null) {
        const existCardInfo = getStorageObject(CARD_INFO);
        if (existCardInfo.date !== date) {
            setStorageItem(updateCardInfo(existCardInfo, {
                date: date,
                close: false
            }));
            showTemplate();
        }
    } else {
        setStorageItem(updateCardInfo(cardInfo,{
            startDate: startDate,
            endDate: endDate,
            open: true,
            today: todayTime,
            date: date
        }));
        showTemplate();
    }
} else {
    deleteStorageItem(CARD_INFO);
}

$('#popupCardClose').on('click', function() {
    var newCardInfo = getStorageObject(CARD_INFO);
    updateCardInfo(newCardInfo, {close: true});
    setStorageItem(newCardInfo);
});
