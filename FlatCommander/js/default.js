﻿// For an introduction to the Blank template, see the following documentation:
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

            WinJS.UI.disableAnimations();

            args.setPromise(WinJS.UI.processAll().done(function (someValue) {
                var folderPanelContainer = document.getElementById("folderPanelContainer");
                initFolderPanelContainer(folderPanelContainer);
                folderPanelContainer.setFolder(Windows.Storage.KnownFolders.picturesLibrary);
            }));
        }
    };


    function initFolderPanelContainer(folderPanelContainer) {
        folderPanelContainer.setFolder = FolderPanel.setFolder;

        var listViewElement = folderPanelContainer.querySelector("#folderItems");

        var listViewOptions = {
            itemTemplate: FolderPanel.storageRenderer,
            layout: new WinJS.UI.ListLayout(),
            selectionMode: "single"
        };

        var listViewControl = new WinJS.UI.ListView(listViewElement, listViewOptions);

        function onItemInvoked(event) {
            event.detail.itemPromise.done(function (item) {
                return function (folderPanelContainer, storageFolder) {
                    if (item.data.attributes & Windows.Storage.FileAttributes.directory) {
                        folderPanelContainer.setFolder(storageFolder);
                    }
                }(folderPanelContainer, item.data);
            });
        }

        listViewControl.addEventListener("iteminvoked", onItemInvoked, false);
    }


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
