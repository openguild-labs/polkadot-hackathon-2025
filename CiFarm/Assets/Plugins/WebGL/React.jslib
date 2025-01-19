mergeInto(LibraryManager.library, {
  Quit: function () {
    window.dispatchReactUnityEvent("Quit");
  },
});