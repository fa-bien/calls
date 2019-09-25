storageMethod = 'localStorage';

try {
    if (typeof chrome && typeof chrome.app && typeof chrome.app.runtime
        && typeof chrome.storage.sync  ) {
        // Running inside a Chrome App context
        storageMethod = 'chrome.storage.sync';
    }
} catch (e) { }

function getDelayFromStorage() {
    if (storageMethod == 'localStorage') {
        if ('autoUpdateDelay' in localStorage) {
            autoUpdateDelay =
                JSON.parse(localStorage.getItem('autoUpdateDelay'));
        }
        delayText.textContent = autoUpdateDelay + '" between updates';
    } else if (storageMethod.substring(0, 14) == 'chrome.storage' ) {
        var callback = function (x) {
            if ('autoUpdateDelay' in x) {
                autoUpdateDelay = x['autoUpdateDelay'];
            }
            delayText.textContent = autoUpdateDelay + '" between updates';
        };
        if (storageMethod == 'chrome.storage.sync') {
            chrome.storage.sync.get('autoUpdateDelay', callback);
        } else if (storageMethod == 'chrome.storage.local') {
            chrome.storage.sync.get('autoUpdateDelay', callback);
        }
    } else {
        console.log('Unknown storage method:', storageMethod);
    }
}

function setDelayToStorage() {
    if (storageMethod == 'localStorage') {
        localStorage.setItem('autoUpdateDelay',
                             JSON.stringify(autoUpdateDelay));
    } else if (storageMethod.substring(0, 14) == 'chrome.storage' ){
        var tmp = {};
        tmp['autoUpdateDelay'] = autoUpdateDelay;
        var callback = function() {
        };
        if ( storageMethod == 'chrome.storage.sync' ) {
            chrome.storage.sync.set( tmp, callback );
        } else if (storageMethod == 'chrome.storage.local') {
            chrome.storage.local.set( tmp, callback );
        }
    } else {
        console.log('Unknown storage method:', storageMethod);
    }
}
