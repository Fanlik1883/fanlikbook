class CookiesClass {
    constructor() {
        console.log('Инициализация CookiesClass');
        this.updateCookieState()
        this.checkboxes = ['TranslateRusPanel', 'ReadRusPanel', 'ReadEngPanel', 'HideEngPanel', 'HideRusPanel','FirstLang','readYourself'];
        this.start_cookie()
        this.restoreCheckboxState()


    }

    updateCookieState() {
        document.getElementById('TranslateRusPanel').onchange = function () { 
            CookiesUp.setCookieMy('TranslateRusPanel', document.getElementById('TranslateRusPanel').checked.toString()); 
        }
        document.getElementById('ReadRusPanel').onchange = function () { 
            CookiesUp.setCookieMy('ReadRusPanel', document.getElementById('ReadRusPanel').checked.toString()); 
        }
        document.getElementById('ReadEngPanel').onchange = function () { 
            CookiesUp.setCookieMy('ReadEngPanel', document.getElementById('ReadEngPanel').checked.toString()); 
        }
        document.getElementById('HideEngPanel').onchange = function () { 
            CookiesUp.setCookieMy('HideEngPanel', document.getElementById('HideEngPanel').checked.toString()); 
        }
        document.getElementById('HideRusPanel').onchange = function () { 
            CookiesUp.setCookieMy('HideRusPanel', document.getElementById('HideRusPanel').checked.toString()); 
        }
        document.getElementById('FirstLang').onchange = function () { 
            CookiesUp.setCookieMy('FirstLang', document.getElementById('FirstLang').checked.toString()); 
        }
        document.getElementById('readYourself').onchange = function () { 
            CookiesUp.setCookieMy('readYourself', document.getElementById('readYourself').checked.toString()); 
        }
    }

    restoreCheckboxState() {
        this.checkboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            const checkedValue = getCookie(id) === 'true';
            if (checkbox && typeof checkedValue !== 'undefined') { 
                checkbox.checked = checkedValue; 
            }
        });
    }
    
    start_cookie() {
        setTimeout(function() {
            console.log('Загрузка cookie настроек');
            Panel.voiceEngSelect.selectedIndex = getCookie('voice0_num');
            Panel.rateEngRange.value = getCookie("rate0")
            Panel.rateEngOut.textContent = Panel.rateEngRange.value
            Panel.voiceRusSelect.selectedIndex = getCookie('voice_num');
            Panel.rateRusRange.value = getCookie("rate")
            Panel.rateRusOut.textContent = Panel.rateRusRange.value
        }, 200)
    }

    updateVoice() {
        CookiesUp.setCookieMy("voice0_num", Panel.voiceEngSelect.value)
        CookiesUp.setCookieMy("voice_num", Panel.voiceRusSelect.value)
    }

    setCookieMy(name, data) {
        setCookie(name, data, {
            expires: new Date(Date.now() + 86400 * 1000 * 30 * 12),
            path: '/'
        })
    }
}