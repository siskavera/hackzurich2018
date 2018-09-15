// send the page title as a chrome message
//chrome.runtime.sendMessage(document.title);

//recipe_name = document.getElementsByClassName('recipe-header__title')[0].innerText
//chrome.runtime.sendMessage(recipe_name);

recipe_name = document.getElementsByClassName('recipe-header__title')[0].innerHTML
chrome.runtime.sendMessage(['title',recipe_name])

ingredients = document.getElementsByClassName('ingredients-list__item')
for (i = 0; i < ingredients.length; i++) { 
    chrome.runtime.sendMessage(['ingredient',ingredients[i].getAttribute("content")])
}

chrome.runtime.sendMessage(['end','end'])