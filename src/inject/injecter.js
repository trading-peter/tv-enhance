function initShortcuts() {
	chrome.storage.sync.get([ 'shortcuts' ], value => {
		const { shortcuts } = value;
		setTimeout(() => {
			document.dispatchEvent(new CustomEvent('tvh_shortcuts', { detail: shortcuts, bubbles: true, composed: true }));
		}, 100);
	});
}

const s = document.createElement('script');
s.src = chrome.runtime.getURL('src/inject/inject.js');
s.onload = initShortcuts;

setTimeout(() => {
	(document.head||document.documentElement).appendChild(s);
}, 0);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == 'reloadShortcuts') {
		initShortcuts();
	}
});