// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            args.setPromise(WinJS.UI.processAll().done(function (someValue) {
                var storageFolder = Windows.Storage.KnownFolders.picturesLibrary;

                var currentDirectoryDiv = document.getElementById("currentDirectoryDiv");
                currentDirectoryDiv.textContent = storageFolder.displayName;

                var listElement = document.getElementById("directoryItems");

                storageFolder.getItemsAsync().done(function (items) {
                    items.forEach(function (item) {
                        var listItemElement = document.createElement("li");
                        if (item.isOfType(Windows.Storage.StorageItemTypes.folder)) {
                            listItemElement.textContent = item.name + "\\";
                        } else {
                            listItemElement.textContent = item.name;
                        }
                        listElement.appendChild(listItemElement);
                    });
                });

            }));
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();
