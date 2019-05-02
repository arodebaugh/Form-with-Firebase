var db = firebase.firestore();

window.onload = function() { // Runs code on load
    restoreFormPopup();
    pageTwoState();
    grabFromLocalStorage();

    db.collection("form").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var tableRef = document.getElementById('table').getElementsByTagName('tbody')[0];
            var newRow = tableRef.insertRow(tableRef.rows.length);

            for (var key in doc.data()) {
                var newCell = newRow.insertCell(0);
                var newText = document.createTextNode(doc.data()[key]);
                newCell.appendChild(newText);
            }
            

            console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        });
    });    
};

String.prototype.addAt = function (index, character) {
    return this.substr(0, index - 1) + character + this.substr(index-1 + character.length-1);
}

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};

function grabFromLocalStorage() {
    // This takes the data from local storage and sets the textbox to the values.
    var data = JSON.parse(window.localStorage.getItem("data"));
    if (data) {
        document.getElementById("knowledge").value = data.knowledge;
        document.getElementById("skills").value = data.skills;
        document.getElementById("different").value = data.different;
        document.getElementById("accomplishment").value = data.accomplishment;
        document.getElementById("improve").value = data.improve;
        document.getElementById("collaborate").value = data.collaborate;
        document.getElementById("feedback").value = data.feedback;
    } else {
        // No data was found... do nothing.
        document.getElementById("restored").style.display = "none";
    }
}

function saveToLocalStorage(page) {
    // Sets local storage to what page it is on.
    if (page == 1) {
        window.localStorage.setItem("page", "2");
    } else if (page == 2) {
        window.localStorage.setItem("restored", "true");
    }

    // This is the data grabbed from the textboxes into a JSON Object.
    var data = {
        "knowledge" : document.getElementById("knowledge").value,
        "skills" : document.getElementById("skills").value,
        "different" : document.getElementById("different").value,
        "accomplishment" : document.getElementById("accomplishment").value,
        "improve" : document.getElementById("improve").value,
        "collaborate" : document.getElementById("collaborate").value,
        "feedback" : document.getElementById("feedback").value
    };

    // Place data in local storage.
    window.localStorage.setItem("data", JSON.stringify(data));
}

function checkPI() {
    var piDiv = document.getElementById('pi');
    getJSON('https://api.pi.delivery/v1/pi?numberOfDigits=' + (piDiv.value.length - 1),
    function(err, data) {
        if (err !== null) {
            alert('Something went wrong: ' + err);
        } else {
            if (data.content.addAt(2, '.') === piDiv.value) {
                alert(piDiv.value + " is correct!");
            } else {
                alert(piDiv.value + " is wrong!");
            }
        }
    });
}

function saveToFirebase(page) {
    if (page == 1) {
        window.localStorage.setItem("page", "2");
    } else if (page == 2) {
        window.localStorage.setItem("restored", "true");
        var data = {
            "knowledge" : document.getElementById("knowledge").value,
            "skills" : document.getElementById("skills").value,
            "different" : document.getElementById("different").value,
            "accomplishment" : document.getElementById("accomplishment").value,
            "improve" : document.getElementById("improve").value,
            "collaborate" : document.getElementById("collaborate").value,
            "feedback" : document.getElementById("feedback").value
        };
    
        db.collection("form").add(data)
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            restartForm();
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }
}

function restoreFormPopup() {
    // This is the toggle for the visability of the restore popup.
    if (window.localStorage.getItem("restored") == "true") {
        document.getElementById("restored").style.display = "block";
        window.localStorage.setItem("restored", "false");
    } else {
        document.getElementById("restored").style.display = "none";
    }
}

function pageTwoState() {
    // Shows the page 2 if local storage is told to.
    if (window.localStorage.getItem("page") == 2) {
        document.getElementById("part2").style.display = "block";
        document.getElementById("next1").style.display = "none";
    }
}

function restartForm() {
    // Reset and clear form.
    window.localStorage.setItem("page", "1");
    window.localStorage.setItem("restored", "false");
    window.localStorage.setItem("data", null);
    document.getElementById("knowledge").value = "";
    document.getElementById("skills").value = "";
    document.getElementById("different").value = "";
    document.getElementById("accomplishment").value = "";
    document.getElementById("improve").value = "";
    document.getElementById("collaborate").value = "";
    document.getElementById("feedback").value = "";
    window.location.reload();
}
