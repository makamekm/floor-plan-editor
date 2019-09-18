self.addEventListener("message", async (event) => {
  switch (event.data.type) {
    case "process":
      // Skip any preprocessing
      break;
    case "load":
      // Skip
      break;
  }
  self.postMessage("answer");
});
