chrome.runtime.onMessage.addListener((data) => {
  if (data.action === "bookBreakfast") {
    console.log("Booking breakfast...");
    // Add your booking logic here
  } else if (data.action === "bookLunch") {
    console.log(`Booking lunch as ${data.type}...`);
    // Add your booking logic here
  } else if (data.action === "bookDinner") {
    console.log(`Booking dinner as ${data.type}...`);
    // Add your booking logic here
  }
});
