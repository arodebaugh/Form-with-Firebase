var db = firebase.firestore();

window.onload = function() {
    db.collection("form").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var tableRef = document.getElementById('table').getElementsByTagName('tbody')[0];
            var newRow = tableRef.insertRow(tableRef.rows.length);

            for (var key in doc.data()) {
                var newCell = newRow.insertCell(0);
                var newText  = document.createTextNode(doc.data()[key]);
                newCell.appendChild(newText);
            }
            
            newCell = newRow.insertCell(0);
            newText = document.createElement("a");
            newText.setAttribute("href", "javascript:deleteRow(\'" + doc.id + "\')");
            newText.innerText = "delete";
            newCell.appendChild(newText);

            console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        });
    });    
};

function deleteRow(id) {
    db.collection("form").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
        window.location.reload();
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}