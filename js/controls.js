L.Control.Mode = L.Control.extend({
	initialize: function(id, style, title, alt, options) {
        L.setOptions(this, options);
        this._id = id;
        this._style = style;
        this._title = title;
        this._alt = alt;
	},
    onAdd: function(map) {
        let button = L.DomUtil.create("button", "btn btn-dark btn-sm btn-block");
        button.type = "button";
        button.id = this._id;
        button.alt = this._alt;
        button.title = this._title;
        button.appendChild(L.DomUtil.create("i", this._style));

        return button;
    },
    onRemove: function(map) {
        //
    },
});

L.control.mode = (id, style, title, alt, options) => new L.Control.Mode(id, style, title, alt, options);

L.Control.TextInput = L.Control.extend({
	initialize: function(id, placeholder, options) {
        L.setOptions(this, options);
        this._id = id;
        this._placeholder = placeholder;
	},
    onAdd: function(map) {
        let input = L.DomUtil.create("input", "form-control");
        input.type = "text";
        input.id = this._id;
        input.placeholder = this._placeholder;

        return input;
    },
    onRemove: function(map) {
        //
    },
});

L.control.textinput = (id, placeholder, options) => new L.Control.TextInput(id, placeholder, options);

/*L.Control.Mode = L.Control.extend({
    _alt: "Bouton : Déplacer Carte",
    _listeners: [],
    _style: "fas fa-arrows-alt",
    _title: "Déplacer Carte",
	initialize: function(geoData, options) {
		L.setOptions(this, options);
        deleteOldMarkers(geoData);
	},
    onAdd: function(map) {
        let button = L.DomUtil.create("button", "btn btn-dark btn-sm btn-block");
        button.type = "button";
        button.alt = this._alt;
        button.title = this._title;
        button.appendChild(L.DomUtil.create("i", this._style));

        return button;
    },
    onRemove: function(map) {
        this.removeListeners();
    },
    removeListeners: function() {
        this._listeners.forEach(listener => {
            listener.object.off(listener.event, listener.function);
        });
    }
});

L.control.mode = (geoData, options) => new L.Control.Mode(geoData, options);

L.Control.MovePointMode = L.Control.Mode.extend({
    _alt: "Bouton : Déplacer Point",
    _style: "fas fa-hand-pointer",
    _title: "Déplacer Point",
    onAdd: function(map) {
        return L.Control.Mode.prototype.onAdd.call(this, map);
    },
    onRemove: function(map) {
        L.Control.Mode.prototype.onRemove.call(this, map);
    }
});

L.control.movepointmode = (geoData, options) => new L.Control.MovePointMode(geoData, options);*/