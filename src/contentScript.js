import MainPage from './mainPage.js';
import ProviderDetector from './providerDetector.js';

function main() {
	const detector = new ProviderDetector();
	const mainPage = new MainPage(detector.getProviderForCurrentUrl());
	mainPage.init();
}

main();