noInfoFoodName = "no info"

food_data = {
  "apple": {
  	"impact": 1.0,
  	"replacement": ""
  },
  "beef": {
  	"impact": 10.5,
  	"replacement": "lentils"
  },
  "flour": {
  	"impact": 0.5,
  	"replacement": ""
  },
  "butter": {
  	"impact": 9.4,
  	"replacement": "oil"
  },
  "egg": {
  	"impact": 5.5,
  	"replacement": "flax egg"
  },
  "sugar": {
  	"impact": 3.0,
  	"replacement": ""
  },
  "oil": {
  	"impact": 12.1,
  	"replacement": ""
  },
  "parsnip": {
  	"impact": 0.5,
  	"replacement": ""
  }
};

unit_to_kg = {
	"kg": 1.0,
	"g": 0.01,
	"l": 1.0,
	"ml": 0.001
};

individual_to_kg = {
	"egg": 0.05,
	"lemon": 0.1
}

maxImpact = 0.0
maxImpactFood = ''

// Inject the payload.js script into the current tab after the popup has loaded
window.addEventListener('load', function (evt) {
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'payload.js'
	});
});

// Listen to messages from the payload.js script and write to popup.html
chrome.runtime.onMessage.addListener(function (message) {
	type = message[0]
	message = message[1]

	if (type == 'ingredient') {
		addIngredient(message)
	} else if (type == 'title') {
		setTitle(message)
	} else if (type == 'end') {
		colorWorstIngredient()
		suggestReplacement()
	}
});

function colorWorstIngredient() {
	worseIngredientRow = document.getElementById(maxImpactFood)
	worseIngredientRow.style.color = "#7F0000"
	worseIngredientRow.style.fontWeight = "bold"
	worseIngredientRow.style.outline = "thin solid"
}

function suggestReplacement() {
	replacementFood = food_data[maxImpactFood].replacement
	replacementText = '<br>'
	replacementText += 'Instead of '
	replacementText += maxImpactFood
	replacementText += ', you could try using '
	replacementText += replacementFood
	replacementText += '!'

	if (replacementFood != '') {
		replacementDiv = document.getElementById('replacement_suggestion')
		replacementDiv.innerHTML = replacementText
	}
}

function setTitle(message) {
	recipeTitle = document.getElementById('recipe_name')
	recipeTitle.innerHTML = message
}

function addIngredient(message) {
	costTable = document.getElementById('cost_table')
	costTableBody = document.createElement('tbody')

	amountReturn = getFirstAmount(message)
	firstAmount = amountReturn[0]
	firstAmountUnit = amountReturn[1]
	foodName = getFirstFood(message)

	if (!(foodUnitPairIsValid(foodName, firstAmountUnit))) { // Is unit valid or if not, is food measured in individuals?
		foodName = noInfoFoodName
	}
	
	if (foodName != noInfoFoodName) {
		impactValue = getImpact(foodName, firstAmount, firstAmountUnit)
		if (impactValue > maxImpact) { // Problem if ingredient appears more than once!
			maxImpact = impactValue
			maxImpactFood = foodName
		}

		costRow = createCostRow(foodName, firstAmount, firstAmountUnit, impactValue)
		costTableBody.appendChild(costRow)
		costTable.appendChild(costTableBody)
		DatabaseConnector.get("Peas", function (kg_co2_per_kg) {
            console.log("result: " + kg_co2_per_kg);
        });
	}
}

function getFirstFood(message) {
	words = message.split(/[\s,\(\\/)]+/)

	foodName = noInfoFoodName
	for (i = 0; i < words.length; i += 1) {
		if ((words[i] in food_data)) {
			foodName = words[i]
			break
		} else if (words[i].slice(0, -1) in food_data) { // Plural
			foodName = words[i].slice(0, -1)
			break
		}
	}

	return foodName
}

function foodUnitPairIsValid(foodName, unit) {
	// foodName is already valid
	if (unit in unit_to_kg) {
		return true
	}
	if (foodName in individual_to_kg) {
		return true
	}
	return false
}

function getImpact(foodName, amount, unit) {
	impactPerKg = food_data[foodName].impact

	// We made sure it's valid
	if (unit in unit_to_kg) {
		unitInKg = amount * unit_to_kg[unit]
	} else {
		unitInKg = amount * individual_to_kg[foodName]
	}

	totalImpact = impactPerKg * unitInKg
	return totalImpact
}

function getFirstAmount(message) {
	has_integer_regex = /\d/
	integer_regex = /\d+/
	unit_regex = /\d+([a-zA-Z½]*)[\s,\(\)\/]+/


	if (has_integer_regex.test(message)) {
		firstAmount = message.match(integer_regex)[0]
		firstAmountUnit = message.match(unit_regex)[1] // Matching group
	} else {
		firstAmount = ""
		firstAmountUnit = ""
	}

	return [firstAmount, firstAmountUnit]
}

function createCostRow(foodName, firstAmount, firstAmountUnit, impactValue) {
	costRow = document.createElement('tr')

	ingredientData = document.createElement('td')
	ingredientText = firstAmount + firstAmountUnit + " " + foodName
	ingredient = document.createTextNode(ingredientText)
	ingredientData.appendChild(ingredient)
	costRow.appendChild(ingredientData)
	
	impactData = document.createElement('td')
	impactText = impactValue.toFixed(3)
	impact = document.createTextNode(impactText)
	impactData.appendChild(impact)
	costRow.appendChild(impactData)
	costRow.id = foodName

	return costRow
}