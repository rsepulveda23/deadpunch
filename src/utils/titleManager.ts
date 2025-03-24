
/**
 * Title manager utility to ensure the correct title is always displayed
 */

// Initialize title correction on script load
(() => {
  // Set title immediately
  document.title = "DEADPUNCH";
  
  // Set up a periodic check outside of React lifecycle
  setInterval(() => {
    if (document.title !== "DEADPUNCH") {
      document.title = "DEADPUNCH";
    }
  }, 200);
})();

export const enforceTitle = () => {
  document.title = "DEADPUNCH";
};
