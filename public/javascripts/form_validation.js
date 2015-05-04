function validateForm(expectedString) {
    var fileName = document.forms["fileForm"]["file"].value;
    var expectedRevised = expectedString.substring(0, expectedString.length - 4) + '_rv.csv';
    var fileRevised = fileName.substring(fileName.length - expectedRevised.length);
    fileName = fileName.substring(fileName.length - expectedString.length);
    var valid = (expectedString == fileName || expectedRevised == fileRevised);
    if (!valid) {
	alert("Unexpected File");
    }
    return valid;
}
