// Async boundary required by Module Federation.
// index.js must NOT directly import React — it dynamically
// imports bootstrap.js so shared singletons (react, react-dom)
// are initialised before the app renders.
import("./bootstrap");
