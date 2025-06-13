function sendMeal(action, type) {
  console.log(`Sending action: ${action}, type: ${type}`);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action, type });
  });
}

document.getElementById("breakfast").addEventListener("click", () => {
  sendMeal("bookBreakfast", "");
});

document.getElementById("lunch-dine-in").addEventListener("click", () => {
  sendMeal("bookLunch", "dine-in");
});

document.getElementById("lunch-take-away").addEventListener("click", () => {
  sendMeal("bookLunch", "take-away");
});

document.getElementById("dinner-dine-in").addEventListener("click", () => {
  sendMeal("bookDinner", "dine-in");
});

document.getElementById("dinner-take-away").addEventListener("click", () => {
  sendMeal("bookDinner", "take-away");
});
document.getElementById("cancel-all").addEventListener("click", () => {
  sendMeal("cancel-all", "");
  console.log("Cancelling all meals...");
});
document.getElementById("all-dine-in").addEventListener("click", () => {
  sendMeal("all-dine-in", "");
  console.log("Booking all meals as dine-in...");
});
document.getElementById("all-take-away").addEventListener("click", () => {
  sendMeal("all-take-away", "");
  console.log("Booking all meals as take-away...");
});
document.getElementById("cancel-breakfast").addEventListener("click", () => {
  sendMeal("cancel-breakfast", "");
  console.log("Cancelling breakfast...");
});
document.getElementById("cancel-lunch").addEventListener("click", () => {
  sendMeal("cancel-lunch", "");
  console.log("Cancelling lunch...");
});
document.getElementById("cancel-dinner").addEventListener("click", () => {
  sendMeal("cancel-dinner", "");
  console.log("Cancelling dinner...");
});
