class Converter {
  constructor() {
    this.jsonArea = document.getElementById("json-area");
    this.csvArea = document.getElementById("csv-area");
    this.openFileButton = document.getElementById("openFile-btn");
    this.fileSelector = document.getElementById("file-selector");
    this.saveFileButton = document.getElementById("saveFile-btn");
    this.convertButton = document.getElementById("convert-btn");
    this.clearButton = document.getElementById("clear-btn");

    this.configureSaveFileBtnClick();
    this.configureConvertBtnClick();
    this.configureClearBtnClick();
    this.configureOpenFileBtnClick();
    this.configureFileReader();
  }

  parseData(data) {
    return data.map((elem) => {
      if (typeof elem === "string") {
        return `"${elem}"`;
      }

      return elem;
    });
  }

  parseJSON(json) {
    const data = JSON.parse(json);

    if (Array.isArray(data)) {
      return data;
    } else {
      return [data];
    }
  }

  JSONtoCSV(json) {
    const data = this.parseJSON(json);

    let header = this.parseData(Object.keys(data[0])).join(",");
    let body = "";

    for (let i = 0; i < Object.keys(data).length; i++) {
      body += `${this.parseData(Object.values(data[i])).join(",")}\n`;
    }

    const csv = `${header}\n${body}`;

    return csv;
  }

  getJSON() {
    const jsonData = this.jsonArea.value;

    return jsonData;
  }

  getCSV() {
    const csvData = this.csvArea.value;

    return csvData;
  }

  setCSV(csv) {
    this.csvArea.value = csv;
  }

  resetFileSelector() {
    this.fileSelector.value = "";
  }

  resetJSONArea() {
    this.jsonArea.value = "";
  }

  resetCSVArea() {
    this.csvArea.value = "";
    this.csvArea.className = "";
  }

  isValidJSON(json) {
    try {
      JSON.parse(json);
      return true;
    } catch (error) {
      this.invalidJSONMessage(error);
      return false;
    }
  }

  isValidCSV(csv) {
    if (csv.length === 0) {
      alert("CSV is empty!");
      return false;
    }

    return true;
  }

  invalidJSONMessage(error) {
    this.csvArea.className = "error";

    if (error.message.includes("Unexpected end of JSON input")) {
      this.csvArea.value = "Please upload a file or type in something!";
    } else {
      this.csvArea.value = `Invalid JSON! \n\n${error.message}`;
    }
  }

  convert() {
    const json = this.getJSON();

    if (this.isValidJSON(json)) {
      const csv = this.JSONtoCSV(json);

      this.resetCSVArea();
      this.setCSV(csv);
    }
  }

  clear() {
    this.resetCSVArea();
    this.resetJSONArea();
    this.resetFileSelector();
  }

  async writeFile(fileHandle, contents) {
    const writable = await fileHandle.createWritable();

    await writable.write(contents);
    await writable.close();
  }

  async saveFile() {
    const csvFile = this.getCSV();

    if (this.isValidCSV(csvFile)) {
      const blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, "download.csv");
      } else {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: "download",
          types: [
            {
              accept: { "text/csv": [".csv"] },
            },
          ],
        });

        await this.writeFile(fileHandle, blob);
      }
    }
  }

  configureFileReader() {
    this.fileSelector.addEventListener("change", (event) => {
      const reader = new FileReader();
      const file = event.target.files[0];
      const blob = new Blob([file]);

      reader.addEventListener("load", (event) => {
        if (event.target.result !== "undefined") {
          this.jsonArea.value = event.target.result;
        }
      });

      reader.readAsText(blob);
    });
  }

  configureConvertBtnClick() {
    this.convertButton.addEventListener("click", () => this.convert());
  }

  configureClearBtnClick() {
    this.clearButton.addEventListener("click", () => this.clear());
  }

  configureSaveFileBtnClick() {
    this.saveFileButton.addEventListener("click", () => this.saveFile());
  }

  configureOpenFileBtnClick() {
    this.openFileButton.addEventListener("click", () => {
      this.fileSelector.click();
    });
  }
}

export default Converter;
