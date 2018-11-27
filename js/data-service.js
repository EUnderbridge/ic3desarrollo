(function() {
  function fetchFile(url, cb) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "arraybuffer";
    req.onerror = function() {
      cb(new Error("Could not load file " + url));
    }
    req.onload = function() {
      const arrayBuffer = req.response;
      cb(null, arrayBuffer);
    }
    req.send();
  }

  function parseArrayBufferAsXlsxWorkbook(arrayBuffer) {
    const data = new Uint8Array(arrayBuffer);
    const binaryString = Array.from(data).map((d) => String.fromCharCode(d)).join("");
    const workbook = XLSX.read(binaryString, { type: "binary" });
    return workbook;
  }

  function getWorkbookSheetBySheetIndex(workbook, sheetIndex) {
    const sheetName = workbook.SheetNames[sheetIndex];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet, { raw: true });
  }

  function isGeoUnitSupported(geoUnit) {
    return ["country", "district", "province"].indexOf(geoUnit) >= 0;
  }

  function getNormalizedDiseaseFilename(opts) {
    const disease = opts.disease;
    const prefix = opts.prefix || "E";
    return prefix + "_" + disease + ".xlsx";
  }

  function getGeoDataFileUrl(opts) {
    const disease = opts.disease;
    const geoUnit = opts.geoUnit;
    if (!isGeoUnitSupported(geoUnit)) {
      throw new Error("Unsupported geo unit type: " + geoUnit);
    }
    const prefixByGeoUnit = {
      "country": "E",
      "district": "C",
      "province": "P",
    }
    const filename = getNormalizedDiseaseFilename({
      disease: disease,
      prefix: prefixByGeoUnit[geoUnit],
    });
    return ["..", "docss", "carto", geoUnit, filename].join("/");
  }

  function getTrendDataFileUrl(opts) {
    const disease = opts.disease;
    const country = opts.country;
    const filename = getNormalizedDiseaseFilename({ disease: disease });
    return ["..", "docss", "trend", country, filename].join("/");
  }

  function fetchXlsxFile(url, cb) {
    fetchFile(url, (error, data) => {
      if (error) {
        return cb(error);
      }
      const workBook = parseArrayBufferAsXlsxWorkbook(data);
      cb(null, workBook);
    });
  }

  function getGeoDiseaseDataByGeoUnit(disease, geoUnit, cb) {
    const url = getGeoDataFileUrl({ geoUnit: geoUnit, disease: disease });
    fetchXlsxFile(url, (error, workBook) => {
      if (error) {
        cb(new Error("Could not load disease geo data file for country due to:" + error.message));
        return;
      }
      const sheet = getWorkbookSheetBySheetIndex(workBook, 0);
      // TODO: Valiadte sheeet elements structure
      cb(null, sheet);
    });
  }

  function getTrendDiseaseDataByCountry(disease, country, cb) {
    const url = getTrendDataFileUrl({ country: country, disease: disease });
    fetchFile(url, (error, data) => {
      if (error) {
        cb(new Error("Could not load disease trend data file for country due to:" + error.message));
        return;
      }
      const workBook = parseArrayBufferAsXlsxWorkbook(data);
      const sheet = getWorkbookSheetBySheetIndex(workBook, 1);
      // TODO: Valiadte sheeet elements structure
      cb(null, sheet);
    });
  }

  function getGeoAllDiseaseDataByGeoUnit(geoUnit, cb) {
    getGeoDiseaseDataByGeoUnit("totalEERR", geoUnit, cb)
  }

  function getTrendAllDiseaseDataByCountry(country, cb) {
    getTrendDiseaseDataByCountry("totalEERR", country, cb);
  }

  window.DataService = {
    getTrendDiseaseDataByCountry: getTrendDiseaseDataByCountry,
    getTrendAllDiseaseDataByCountry: getTrendAllDiseaseDataByCountry,
    getGeoDiseaseDataByGeoUnit: getGeoDiseaseDataByGeoUnit,
    getGeoAllDiseaseDataByGeoUnit: getGeoAllDiseaseDataByGeoUnit,
  };
})();
