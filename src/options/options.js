document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('defaults').addEventListener('click', defaults);
	document.getElementById('save').addEventListener('click', saveOptions);
	document.getElementById('addPrompt').addEventListener('click', addPrompt);
	restoreOptions();
});

function saveOptions() {
	const apiToken = document.getElementById('apiToken').value;
	const model = document.getElementById('model').value;
	const maxTokens = document.getElementById('maxTokens').value;
	const temperature = document.getElementById('temperature').value;

	let userPrompts = [];
	const userPromptElements = document.querySelectorAll('.userPrompt');
	userPromptElements.forEach((promptElement) => {
		const role = promptElement.querySelector('.roleSelect').value;
		const content = promptElement.querySelector('.promptInput').value;
		userPrompts.push({ role, content });
	});

	chrome.storage.sync.set({ apiToken, model, maxTokens, temperature, userPrompts });
}

function restoreOptions() {
	chrome.storage.sync.get(
		['apiToken', 'model', 'maxTokens', 'temperature', 'userPrompts'],
		function (data) {
			if (data.apiToken) {
				document.getElementById('apiToken').value = data.apiToken;
			}
			if (data.model) {
				document.getElementById('model').value = data.model;
			}
			if (data.maxTokens) {
				document.getElementById('maxTokens').value = data.maxTokens;
			}
			if (data.temperature) {
				document.getElementById('temperature').value = data.temperature;
			}
			if (data.userPrompts) {
				const userPromptsContainer = document.getElementById('userPrompts');
				userPromptsContainer.innerHTML = '';
				data.userPrompts.forEach((prompt, index) => {
					addUserPromptElement(prompt.role, prompt.content);
				});
			}
		}
	);
}

function addPrompt() {
	addUserPromptElement();
}

function addUserPromptElement(role = 'user', content = '') {
	const userPromptsContainer = document.getElementById('userPrompts');
	const newIndex = userPromptsContainer.childElementCount;

	const promptElement = document.createElement('div');
	promptElement.classList.add('userPrompt', 'border-b', 'border-gray-600');
	promptElement.setAttribute('data-index', newIndex);

	const roleSelect = document.createElement('select');
	roleSelect.classList.add('roleSelect', 'mt-1', 'mb-1', 'block', 'w-32', 'py-2', 'px-3', 'border', 'border-gray-600', 'bg-gray-700', 'text-white', 'rounded-md', 'shadow-sm', 'focus:outline-none', 'focus:ring-indigo-500', 'focus:border-indigo-500', 'sm:text-sm');
	const userOption = document.createElement('option');
	userOption.value = 'user';
	userOption.textContent = 'User';
	const assistantOption = document.createElement('option');
	assistantOption.value = 'assistant';
	assistantOption.textContent = 'Assistant';
	roleSelect.append(userOption, assistantOption);
	roleSelect.value = role;

	const removePromptBtn = document.createElement('button');
	removePromptBtn.type = 'button';
	removePromptBtn.classList.add('removePrompt', 'mt-1', 'bg-red-500', 'text-white', 'text-xs', 'px-2', 'py-1', 'rounded', 'shadow-sm', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2', 'focus:ring-red-400');
	removePromptBtn.textContent = 'Remove';
	removePromptBtn.onclick = function () {
		promptElement.remove();
	};

	const promptInput = document.createElement('textarea');
	promptInput.classList.add('promptInput', 'mt-1', 'mb-3', 'block', 'w-full', 'h-32', 'py-2', 'px-3', 'border', 'border-gray-600', 'bg-gray-700', 'text-white', 'rounded-md', 'shadow-sm', 'focus:outline-none', 'focus:ring-indigo-500', 'focus:border-indigo-500', 'sm:text-sm');
	promptInput.type = 'text';
	promptInput.placeholder = 'Enter prompt';
	promptInput.value = content;

	const inputWrapper = document.createElement('div');
	inputWrapper.classList.add('flex', 'items-center', 'justify-between');
	inputWrapper.append(roleSelect, removePromptBtn);

	promptElement.append(inputWrapper, promptInput);
	userPromptsContainer.appendChild(promptElement);
}

function defaults() {
	if (!confirm('Are you sure you want to reset to default settings?')) {
		return;
	}

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

	chrome.storage.sync.set({ ...defaultSettings });
}