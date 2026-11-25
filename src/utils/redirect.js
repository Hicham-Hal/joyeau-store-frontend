// Sends the browser to another website (the Chargily payment page).
// Kept in its own file so it can be replaced in tests.
export function redirectTo(url) {
  window.location.assign(url);
}
