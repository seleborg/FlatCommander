(function () {
    "use strict";

    WinJS.Namespace.define("FlatCommander.Places", {
        initPlacesBar: initPlacesBar,
        onPlaceActivated: onPlaceActivated,
    });


    var onPlaceActivated = function (storageFolder) { };


    function initPlacesBar(element) {
        element.classList.add('fc-placesbar');
        element.appendChild(createPlaceButton(Windows.Storage.KnownFolders.picturesLibrary));
        element.appendChild(createPlaceButton(Windows.Storage.KnownFolders.videosLibrary));
        element.appendChild(createPlaceButton(Windows.Storage.KnownFolders.musicLibrary));
    }


    function createPlaceButton(storageFolder) {
        var elem = document.createElement("span");
        elem.textContent = storageFolder.displayName;
        elem.classList.add('fc-placebutton');
        elem.addEventListener("click", function (event) {
            FlatCommander.Places.onPlaceActivated(storageFolder);
        }, false);
        return elem;
    }
})();