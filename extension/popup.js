// Dummy data :)
// object literal with properties
food_data = {
  "apple": 1.0,
  "beef": 10.5,
  "flour": 0.5,
  "butter": 9.4,
  "eggs": 5.5,
  "sugar": 3.0,
  "oil": 12.1
};

// Inject the payload.js script into the current tab after the popup has loaded
window.addEventListener('load', function (evt) {
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'payload.js'
	});;
});

// Listen to messages from the payload.js script and write to popup.html
chrome.runtime.onMessage.addListener(function (message) {
	costTable = document.getElementById('cost_table')
	costTableBody = document.createElement('tbody')

	amountReturn = getFirstAmount(message)
	firstAmount = amountReturn[0]
	firstAmountUnit = amountReturn[1]
	foodName = getFirstFood(message)
	
	if (foodName != "not found") {
		impactValue = food_data[foodName]
		costRow = createCostRow(foodName, firstAmount, firstAmountUnit, impactValue)
		costTableBody.appendChild(costRow)
		costTable.appendChild(costTableBody)
	}
});

function getFirstAmount(message) {
	has_integer_regex = /\d/
	integer_regex = /\d+/
	unit_regex = /\d+([a-zA-Z]*)[\s,\(\)\/]+/

	if (has_integer_regex.test(message)) {
		firstAmount = message.match(integer_regex)[0]
		firstAmountUnit = message.match(unit_regex)[1] // Matching group
	} else {
		firstAmount = ""
		firstAmountUnit = ""
	}

	return [firstAmount, firstAmountUnit]
}

function getFirstFood(message) {
	words = message.split(/[\s,\(\\/)]+/)

	foodName = "not found"
	for (i = 0; i < words.length; i += 1) {
		if (words[i] in food_data) {
			foodName = words[i]
			break
		}
	}

	return foodName
}

function createCostRow(foodName, firstAmount, firstAmountUnit, impactValue) {
	costRow = document.createElement('tr')

	ingredientData = document.createElement('td')
	ingredientText = firstAmount + firstAmountUnit + " " + foodName
	ingredient = document.createTextNode(ingredientText)
	ingredientData.appendChild(ingredient)
	costRow.appendChild(ingredientData)
	
	impactData = document.createElement('td')
	impactText = impactValue
	impact = document.createTextNode(impactText)
	impactData.appendChild(impact)
	costRow.appendChild(impactData)

	return costRow
}