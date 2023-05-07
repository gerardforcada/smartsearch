import ProviderDetector from './providerDetector.js';

chrome.runtime.onInstalled.addListener(() => {
	const defaultSettings = {
		model: 'gpt-3.5-turbo',
		maxTokens: 50,
		temperature: 0.5,
		userPrompts: [
			{
				role: 'user',
				content: 'You are an AI language model being used in an API integration to assist with advanced {{providerName}} searches. Your output will be written in the {{providerName}} search bar and it must ONLY contain advanced query search patterns that match the following input: {{input}}'
			},
			{
				role: 'user',
				content: 'The output search pattern must not be contained between any quotes (not single nor double), and don\'t say anything else: don\'t talk. Just write the search pattern.'
			}
		]
	};
  
	chrome.storage.sync.set(defaultSettings);
});
  
chrome.tabs.onUpdated.addListener(
	function(tabId, changeInfo, tab) {
		const detector = new ProviderDetector();

		if (changeInfo.url && detector.urlMatchesProvider(changeInfo.url)) {
			chrome.tabs.sendMessage(tabId, {
				message: 'restart',
				url: changeInfo.url
			})
		}
	}
);