// Helper function to wait for a specified time (in milliseconds)
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Delay between clicks in milliseconds (4 seconds)
const CLICK_DELAY_MS = 4000;

// Helper function to properly click a Bootstrap radio button by clicking its label
function triggerClick(input) {
  const label = document.querySelector(`label[for="${input.id}"]`);

  if (label) {
    label.click();
    console.log("🏷️ Clicked label for:", input.id);
  } else {
    input.checked = true;
    input.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new Event('input', { bubbles: true }));
    console.log("🔘 Clicked input directly:", input.id);
  }
}

// Select all meals with a specific composition type
// composition: "1" = dine-in, "2" = take-away, "0" = cancel
async function selectAllByComposition(composition) {
  const selector = `input.btn-check[composition="${composition}"]`;
  const inputs = document.querySelectorAll(selector);

  console.log(`🔍 Found ${inputs.length} inputs matching: ${selector}`);

  if (inputs.length === 0) {
    console.warn("❌ No elements found for:", selector);
    return;
  }

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    console.log(`\n📍 Processing (${i + 1}/${inputs.length}): ${input.id}`);

    triggerClick(input);

    // Wait before the next click (except for the last one)
    if (i < inputs.length - 1) {
      console.log(`⏳ Waiting ${CLICK_DELAY_MS / 1000} seconds before next click...`);
      await sleep(CLICK_DELAY_MS);
    }
  }

  console.log(`\n✅ All ${inputs.length} selections completed!`);
}

// Select meals by type AND meal category (breakfast=1, lunch=2, dinner=3)
async function selectMealsByCategory(composition, repas) {
  let inputs;

  if (repas) {
    const allInputs = document.querySelectorAll(`input.btn-check[composition="${composition}"]`);
    inputs = Array.from(allInputs).filter(input => {
      const name = input.getAttribute('name') || '';
      return name.endsWith(`_${repas}`);
    });
  } else {
    inputs = document.querySelectorAll(`input.btn-check[composition="${composition}"]`);
  }

  console.log(`🔍 Found ${inputs.length} inputs for composition=${composition}, repas=${repas}`);

  if (inputs.length === 0) {
    console.warn("❌ No elements found");
    return;
  }

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    console.log(`\n📍 Processing (${i + 1}/${inputs.length}): ${input.id}`);

    triggerClick(input);

    // Wait before the next click (except for the last one)
    if (i < inputs.length - 1) {
      console.log(`⏳ Waiting ${CLICK_DELAY_MS / 1000} seconds before next click...`);
      await sleep(CLICK_DELAY_MS);
    }
  }

  console.log(`\n✅ All ${inputs.length} selections completed!`);
}

// Message listener for popup commands
chrome.runtime.onMessage.addListener((data) => {
  console.log("📨 Received message:", data);

  if (data.action === "cancel-all") {
    console.log("🚫 Cancelling all meals...");
    selectAllByComposition("0");
  } else if (data.action === "all-dine-in") {
    console.log("🍽️ Booking all meals as dine-in...");
    selectAllByComposition("1");
  } else if (data.action === "all-take-away") {
    console.log("🥡 Booking all meals as take-away...");
    selectAllByComposition("2");
  } else if (data.action === "bookBreakfast") {
    console.log("🌅 Booking breakfast (dine-in)...");
    selectMealsByCategory("1", "1");
  } else if (data.action === "bookLunch") {
    if (data.type === "dine-in") {
      console.log("🍽️ Booking lunch as dine-in...");
      selectMealsByCategory("1", "2");
    } else if (data.type === "take-away") {
      console.log("🥡 Booking lunch as take-away...");
      selectMealsByCategory("2", "2");
    }
  } else if (data.action === "bookDinner") {
    if (data.type === "dine-in") {
      console.log("🍽️ Booking dinner as dine-in...");
      selectMealsByCategory("1", "3");
    } else if (data.type === "take-away") {
      console.log("🥡 Booking dinner as take-away...");
      selectMealsByCategory("2", "3");
    }
  } else if (data.action === "cancel-breakfast") {
    console.log("🚫 Cancelling breakfast...");
    selectMealsByCategory("0", "1");
  } else if (data.action === "cancel-lunch") {
    console.log("🚫 Cancelling lunch...");
    selectMealsByCategory("0", "2");
  } else if (data.action === "cancel-dinner") {
    console.log("🚫 Cancelling dinner...");
    selectMealsByCategory("0", "3");
  }
});

// Auto-fill username functionality
const loginButton = document.querySelector('button[name="login"]');
if (loginButton) {
  loginButton.addEventListener("click", (e) => {
    const username = document.querySelector("#username").value;
    chrome.storage.local.set({ keyName: username }, () => {
      console.log("💾 Username saved:", username);
    });
  });
} else {
  console.warn("⚠️ Login button not found");
}

// Restore username on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", run);
} else {
  run();
}

function run() {
  chrome.storage.local.get("keyName", (data) => {
    const username = data.keyName || "";
    const usernameField = document.querySelector("#username");
    if (usernameField) {
      usernameField.value = username;
      console.log("📋 Username restored:", username);
    }
  });
}

console.log("✅ Ensem Meal Scheduler extension loaded!");
