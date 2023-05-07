import DOM from './dom.js';

export default class MainPage {
	constructor(provider) {
		this.dom = new DOM(provider);
	}

	init() {
		this.dom.registerEvent();
		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if (request.message === "restart") {
				this.dom.registerEvent();
		  	}
		});
	}
}
  