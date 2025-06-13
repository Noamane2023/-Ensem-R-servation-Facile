function sliceObject(obj, startIndex, endIndex) {
  // Convert obj (like NodeList) to array, then slice
  const arr = Array.from(obj);
  const sliced = arr.slice(startIndex, endIndex);
  return sliced; // returns array of DOM elements
}

function selectMeal(type, startIndex, endIndex) {
  const selector = `input[type="radio"][composition="${type}"]`;
  const inputs = document.querySelectorAll(selector);

  const slicedInputs = sliceObject(inputs, startIndex, endIndex);
  console.log("Inputs found:", inputs);
  console.log("Sliced Inputs:", slicedInputs);

  if (slicedInputs.length > 0) {
    slicedInputs.forEach((input) => {
      input.click(); // simulate a click
      input.checked = true; // mark as selected
      console.log("✅ Clicked:", input);
    });
  } else {
    console.warn("❌ No elements found for:", selector);
  }
}
function cancelMeal(startIndex, endIndex) {
  const selector = `input[type="radio"][composition="0"]`;
  const inputs = document.querySelectorAll(selector);

  const slicedInputs = sliceObject(inputs, startIndex, endIndex);
  console.log("Inputs found:", inputs);
  console.log("Sliced Inputs:", slicedInputs);

  if (slicedInputs.length > 0) {
    slicedInputs.forEach((input) => {
      input.click(); // simulate a click
      input.checked = true; // mark as selected
      console.log("✅ Clicked:", input);
    });
  } else {
    console.warn("❌ No elements found for:", selector);
  }
}
function cancelAllMeals() {
  const selector = `input[type="radio"][composition="0"]`;
  const inputs = document.querySelectorAll(selector);

  if (inputs.length > 0) {
    inputs.forEach((input) => {
      input.click(); // Simulate a click
      input.checked = true; // Mark as selected
      console.log("✅ Clicked:", input);
    });
  } else {
    console.warn("❌ No elements found for:", selector);
  }
}
function selectAllMeals(type) {
  const selector = `input[type="radio"][composition="${type}"]`;
  const inputs = document.querySelectorAll(selector);

  if (inputs.length > 0) {
    inputs.forEach((input) => {
      input.click(); // simulate a click
      input.checked = true; // mark as selected
      console.log("✅ Clicked:", input);
    });
  } else {
    console.warn("❌ No elements found for:", selector);
  }
}

chrome.runtime.onMessage.addListener((data) => {
  if (data.action === "cancel-all") {
    cancelAllMeals();
    console.log("Cancelling all meals...");
    return;
  } else if (data.action === "all-dine-in") {
    selectAllMeals("1");
    console.log("Booking all meals as dine-in...");
  } else if (data.action === "all-take-away") {
    selectAllMeals("2");
    console.log("Booking all meals as take-away...");
  } else if (data.action === "bookBreakfast") {
    selectMeal(1, 0, 6);
    console.log("Booking breakfast...");
    // Add your booking logic here
  } else if (data.action === "bookLunch") {
    console.log(`Booking lunch as ${data.type}...`);
    if (data.type === "dine-in") {
      selectMeal(1, 6, 13);
    } else if (data.type === "take-away") {
      selectMeal(2, 0, 7);
    }
  } else if (data.action === "bookDinner") {
    console.log(`Book0ing dinner as ${data.type}...`);
    if (data.type === "dine-in") {
      selectMeal(1, 13, 19);
    } else if (data.type === "take-away") {
      selectMeal(2, 7, 13);
    }
  } else if (data.action === "cancel-breakfast") {
    cancelMeal(0, 6);
    console.log("Cancelling breakfast...");
  } else if (data.action === "cancel-lunch") {
    console.log(`Cancelling lunch...`);
    cancelMeal(6, 13);
  } else if (data.action === "cancel-dinner") {
    console.log(`Cancelling dinner...`);
    cancelMeal(13, 19);
  }
});

const loginButton = document.querySelector('button[name="login"]');
if (loginButton) {
  loginButton.addEventListener("click", (e) => {
    const username = document.querySelector("#username").value;
    chrome.storage.local.set({ keyName: username }, () => {
      console.log("Value is saved:", username);
    });
  });
} else {
  console.warn("Login button not found");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run);
} else {
  run();
}

function run() {
  chrome.storage.local.get("keyName", (data) => {
    const username = data.keyName || "";
    document.querySelector("#username").value = username;
    console.log("Value retrieved:", username);
  });
}
