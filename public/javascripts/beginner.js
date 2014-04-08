var attempts = $("#attempts").text();

/* Start  LocalStorage handler. Code is from Gabriele Cirulli's 2048 http://gabrielecirulli.github.io/2048/ */
window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  this.scoreKey     = "score";
  this.attemptsKey     = "attempts";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";
  var storage = window.localStorage;

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getScore = function () {
  return this.storage.getItem(this.scoreKey) || 0;
};

LocalStorageManager.prototype.setScore = function (score) {
  this.storage.setItem(this.scoreKey, score);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getAttempts = function () {
  return this.storage.getItem(this.attemptsKey) || 0;
};

LocalStorageManager.prototype.setAttempts = function (attempts) {
  this.storage.setItem(this.attemptsKey, attempts);
};

LocalStorageManager.prototype.clearData = function () {
  this.storage.removeItem(this.attemptsKey);
  this.storage.removeItem(this.scoreKey);
};
/* End localstorage code */
var storageManager = new LocalStorageManager;
$('#score').text(storageManager.getScore());
$('#games-started').text(storageManager.getAttempts());

$('#start').click(function (event) {
	console.log("Start button is clicked");
	$('#start').hide();
	$('#intro').hide();
	$('#loading').show();
	$('#guess').show();
	$('#submit').show();
       storageManager.setAttempts(Number(storageManager.getAttempts()) + 1);
       console.log("Attempts changed")
	$.ajax({
		//url: "http://localhost:3000/api/start"
		url: "/api/start"
	}).done(function (data) {
		$('#loading').hide();
                $('#welcome-pane').hide();
		$('#hints').append("<p>Hint 1: "+data['hint1']+"</p>");
		$('#id').val(data['_id']);
	});
});
