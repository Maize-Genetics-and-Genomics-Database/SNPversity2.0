    filename_global = "";
    current_page = 1;
    max_page = 9999;
    dataset = "maizegdb"


    window.onload = function() {
        // Add the event listener to the <select> element when the page loads


        document.getElementById('dataset').addEventListener('change', function() {
            // Get the selected value
            var selectedValue = this.value;

            // Execute your function or logic based on the selected value
            console.log("Selected dataset:", selectedValue);

            // You can call another function or handle the change as needed
            handleDatasetChange(selectedValue);
        });

        // Additional onPageLoad actions can be added here if needed
    };

    function handleDatasetChange(value) {

        toggleCheckboxesAll(0,'.genotypes');
        toggleCheckboxesAll(0,'.genotypes_S');

        var divM = document.querySelector('.maize2024_container');
        var divS = document.querySelector('.schnable2023_container');
        // Example function to handle the change
        if (value === 'mgdb2024_hq') {
            divM.style.display = "block";
            divS.style.display = "none";
            dataset = "maizegdb"
            console.log("MaizeGDB 2024 High Quality selected.");
            // Add your logic here
        } else if (value === 'mgdb2024_hc') {
            divM.style.display = "block";
            divS.style.display = "none";
            dataset = "maizegdb"
            console.log("MaizeGDB 2024 High Coverage selected.");
            // Add your logic here
        } else if (value === 'schnable2023') {
            divM.style.display = "none";
            divS.style.display = "block";
            dataset = "schnable"
            console.log("Schnable 2023 Imputation selected.");
            // Add your logic here
        }
        // Add more logic as needed
    }


    //Activates a DOM element given an ID
    function showContent(id) {

        if(id == "input")
        {
            $('#loadingContainer').css('display', 'none');
            $('#mainContainer').css('display', 'inline');
            $('#outputContainer').css('display', 'none');
            $('#treeContainer').css('display', 'none');
            $('#downloadContainer').css('display', 'none');
            $('#helpContainer').css('display', 'none');

        } else if(id == "output")
        {
            $('#mainContainer').css('display', 'none');
            $('#outputContainer').css('display', 'block');
            $('#treeContainer').css('display', 'none');

            $('#downloadContainer').css('display', 'none');
            $('#helpContainer').css('display', 'none');
        } else if(id == "outputTree")
        {
            $('#loadingContainer').css('display', 'none');
            $('#mainContainer').css('display', 'none');
            $('#outputContainer').css('display', 'none');
            $('#treeContainer').css('display', 'block');
            $('#downloadContainer').css('display', 'none');
            $('#helpContainer').css('display', 'none');
        } else if(id == "download")
        {
            $('#loadingContainer').css('display', 'none');
            $('#mainContainer').css('display', 'none');
            $('#outputContainer').css('display', 'none');
            $('#treeContainer').css('display', 'none');
            $('#downloadContainer').css('display', 'block');
            $('#helpContainer').css('display', 'none');
        } else if(id == "help")
        {
            $('#loadingContainer').css('display', 'none');
            $('#mainContainer').css('display', 'none');
            $('#outputContainer').css('display', 'none');
            $('#treeContainer').css('display', 'none');
            $('#downloadContainer').css('display', 'none');
            $('#helpContainer').css('display', 'block');
        }
    }

    function subtractValue(distance, divcontainer) {
        // Get the current value of the input box
        var currentValue = parseInt(document.getElementById(divcontainer).value, 10);

        // Calculate the new value
        var newValue = currentValue - distance;

        // If the new value is negative, set it to 0
        if (newValue < 0) {
            newValue = 0;
        }

        // Update the input box with the new value
        document.getElementById(divcontainer).value = newValue;
    }

    function addValue(distance, divcontainer) {
        // Get the current value of the input box
        var currentValue = parseInt(document.getElementById(divcontainer).value, 10);

        // Calculate the new value
        var newValue = currentValue + distance;

        // If the new value is negative, set it to 0
        if (newValue < 0) {
            newValue = 0;
        }

        // Update the input box with the new value
        document.getElementById(divcontainer).value = newValue;
    }

    //Code to turn on and off tabs
    function highlightTab(id) {
        // Loop through all elements with class "tab" and remove the 'active' class
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.classList.remove('activeT');
        });

        // Add the 'active' class to the element with the given id
        const activeTab = document.getElementById(id);
        if (activeTab) {
            activeTab.classList.add('activeT');
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        var acc = document.getElementsByClassName("accordion");
        var i;

        highlightTab('Soptions');

        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
                /* Toggle between adding and removing the "active" class,
                to highlight the button that controls the panel */
                this.classList.toggle("active");

                /* Toggle between hiding and showing the active panel */
                var panel = this.nextElementSibling;
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                }
            });
        }
    });  // Added closing parenthesis here

    function getCheckedGenotypes(callback) {
        var fileInput = document.getElementById('fileUpload');
        var accessionValues = [];

        // Check if a file has been uploaded
        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var reader = new FileReader();

            reader.onload = function(e) {
                var lines = e.target.result.split(/\r\n|\n/);
                lines.forEach(function(line) {
                    if (line.trim().length > 0) {
                         accessionValues.push(line);
                     }
                });

                // Call the callback function after file is processed
                callback(JSON.stringify(accessionValues));
            };

            reader.onerror = function(e) {
                console.error("An error occurred reading the file", e);
            };

            reader.readAsText(file);
        } else {
            // Handle the case where no file is uploaded
            var checkboxes = document.querySelectorAll('.genotypes');
            checkboxes.forEach(function(checkbox) {
                if (checkbox.checked) {
                    if(checkbox.value != "skip") {
                        accessionValues.push(checkbox.value);
                        //accessionValues.push(checkbox.value.replace(/@/g, '_'));
                    }
               }
            });

            var checkboxesS = document.querySelectorAll('.genotypes_S');
            checkboxesS.forEach(function(checkbox) {
                if (checkbox.checked) {
                    if(checkbox.value != "skip") {
                        accessionValues.push(checkbox.value);
                    }
               }
            });
            // Call the callback function with values from checkboxes
            callback(JSON.stringify(accessionValues));
        }
    }

    function createUniqueFilename(startV, endV) {
        // Get the current date and time
        const timestamp = Date.now();

        // Generate a random number
        const random = Math.random().toString().slice(2,11);

        // Concatenate date string and random number to create a unique filename
        const filename = `out_${timestamp}_${random}_${startV}_${endV}.vcf`; // Change the extension as needed

        return "./vcf/" + filename;
    }

// Generate and print the unique filename

$(document).ready(function() {
    $('form').on('submit', function(e) {
        e.preventDefault();
        $('#loadingContainer').css('display', 'block');
        $('#loadingContainer').html('<br><br><center><img width="100px" src="./gif/loading.gif" alt="Loading..."><br>Loading table from VCF file</center>');
        $('#outputContainer').html("<div id='outHeader' class='pages'></div><div id='nonPage'><span id='pageData'></span><br><div id='pagination' class='pages'></div><table id='vcfTable'></table> <br><span id='pageDataB'></span><br><div id='paginationBottom' class='pagesB'></div></div>");
        $('#outputContainer').css('width', 'auto');
        $('#mainContainer').css('display', 'none');
        $('#outputContainer').css('display', 'block')

        highlightTab('Voutput');

        var startValue = $('#startInput').val();
        var endValue = $('#endInput').val();
        var chromosome = $('#chrInput').val();
        var dataS = $('#dataset').val();
        var pageValue = $('#pageInput').val(); // This retrieves the value as a string
        var genotypesJson = "";
        var genomic_length = endValue - startValue;
        getCheckedGenotypes(function(genotypesJson) {

            rowsPerPage = parseInt(pageValue, 10); // Converts the string to an integer

            // Check if the conversion resulted in a valid number
            if (isNaN(rowsPerPage)) {
                console.log("The input value is not a valid number.");
                rowsPerPage = 100;
            }
            //console.log(startValue);
            //console.log(endValue);
            //console.log(chromosome);
            //console.log(genotypesJson);
            //console.log(dataS);
            //console.log(filename_global);
            //$('#outputContainer').html('<img src="./gif/loading.gif" alt="Loading...">');
            //$('#loadingContainer').html('<br><br><center><img width="100px" src="./gif/loading.gif" alt="Loading..."><br>Loading table from VCF file</center>');

            filename_global = createUniqueFilename(startValue, endValue);

            $.ajax({
                type: 'POST',
                url: 'processForm.php',
                data: {
                    start: startValue,
                    end: endValue,
                    chr: chromosome,
                    dataSet: dataS,
                    genotypes: genotypesJson,
                    outName: filename_global
                },
                dataType: 'json', // Expecting JSON response
                success: function(response) {
                    // 'response' is already a JavaScript object
                    console.log(response.message);

                    if (response.status === "success") {
                        console.log("VCF created - Success");
                        if (genomic_length < 1000000)
                        {
                            parseVCF(filename_global,chromosome);
                        } else {
                            downloadVCF(filename_global,chromosome);
                        }
                        handleFileSelect2();
                        document.getElementById("tree_block").style.display = "none";

                    } else {
                        console.log("VCF created - Fail");
                        $('#loadingContainer').html('');
                        $('#loadingContainer').css('display', 'none');
                        $('#outHeader').css('display', 'block');
                        const infoDiv = document.getElementById('outHeader');
                        infoDiv.innerHTML = 'The query failed or returned no results.  Change the options and try again.';
                    }
                },
                complete: function() {
                    console.log("VCF created - done");
                    // Hide loading GIF or other actions
                }
            });
        });
    });
});

function downloadVCF(outFile, curChr) {

      fetch(outFile)
        .then(response => {
          if (response.status === 200) {
              let downloadname = outFile.split('/').pop();

              const infoDiv = document.getElementById('outHeader');
              $('#loadingContainer').html('');
              $('#loadingContainer').css('display', 'none');
              infoDiv.innerHTML = 'The table view is only available for genomic regions of 1MB of smaller.<br><br><button id="thedownloadbuttons" onclick="downloadFile(\'' + outFile + '\')">Download the VCF file</button><br><br>';

          } else {
              const infoDiv = document.getElementById('outHeader');
              $('#loadingContainer').html('');
              $('#loadingContainer').css('display', 'none');
              infoDiv.innerHTML = 'The query returned no results.  Change the options and try again.';
          }
        })
        .catch(error => {
              const infoDiv = document.getElementById('outHeader');
              $('#loadingContainer').html('');
              $('#loadingContainer').css('display', 'none');
              infoDiv.innerHTML = 'The query returned no results.  Change the options and try again.';
        });

}

function downloadFile(outFile) {
    // Create an anchor element (`<a>`)
    var downloadLink = document.createElement('a');

    // Get the current date and time
    var now = new Date();
    // Format the date and time as a string in 'YYYY-MM-DD_HH-MM-SS' format
    var timestamp = now.getFullYear() + "-" +
                    ("0" + (now.getMonth() + 1)).slice(-2) + "-" +
                    ("0" + now.getDate()).slice(-2) + "_" +
                    ("0" + now.getHours()).slice(-2) + "-" +
                    ("0" + now.getMinutes()).slice(-2) + "-" +
                    ("0" + now.getSeconds()).slice(-2);

    // Specify the filename for the download, appending the timestamp
    var downloadname = "snpversity_" + timestamp + ".vcf";


    // Set properties of the anchor element to initiate download
    downloadLink.setAttribute('href', outFile);
    downloadLink.setAttribute('download', downloadname);

    // Append the anchor to the document
    document.body.appendChild(downloadLink);

    // Simulate a click on the anchor element
    downloadLink.click();

    // Remove the anchor from the document
    document.body.removeChild(downloadLink);
}

function openPopupM() {
           var myWindow = window.open("", "MsgWindow", "width=820,height=500");
           myWindow.document.open();
           myWindow.document.write('<html><head><title>MaizeGDB 2024 Accessions Table</title><style>table {width: 800px; border-collapse: collapse; font-family: Arial, sans-serif;} td, th {border-bottom: 3px solid #4CAF50; padding: 10px; background-color: #E8F5E9; font-weight: bold;} tr:nth-child(even) {background-color: #F9FBE7;} div {width: 20px; height: 30px;}</style></head><body>');
           myWindow.document.write(document.getElementById("tableToPopupM").innerHTML);
           myWindow.document.write('</body></html>');
           myWindow.document.close();
       }

function openPopupS() {
          var myWindow = window.open("", "MsgWindow", "width=820,height=500");
          myWindow.document.open();
          myWindow.document.write('<html><head><title>Schnable 2023 Accessions Table</title><style>table {width: 800px; border-collapse: collapse; font-family: Arial, sans-serif;} td, th {border-bottom: 3px solid #4CAF50; padding: 10px; background-color: #E8F5E9; font-weight: bold;} tr:nth-child(even) {background-color: #F9FBE7;} div {width: 20px; height: 30px;}</style></head><body>');
          myWindow.document.write(document.getElementById("tableToPopupS").innerHTML);
          myWindow.document.write('</body></html>');
          myWindow.document.close();
      }

function allelePopup() {
          var myWindow = window.open("", "MsgWindow", "width=650,height=250");
          myWindow.document.open();
          myWindow.document.write('<html><head><title>Allele Table</title><style>table {width: 200px; border-collapse: collapse; font-family: Arial, sans-serif;} td, th {border-bottom: 3px solid #4CAF50; padding: 10px; background-color: #E8F5E9; font-weight: bold;} tr:nth-child(even) {background-color: #F9FBE7;} div {width: 20px; height: 20px;}</style></head><body>');
          myWindow.document.write(document.getElementById("alleleToPopup").innerHTML);
          myWindow.document.write('</body></html>');
          myWindow.document.close();
      }

function varPopup() {
          var myWindow = window.open("", "MsgWindow", "width=920,height=800");
          myWindow.document.open();
          myWindow.document.write('<html><head><title>Variant Effects Table</title><style>table {width: 900px; border-collapse: collapse; font-family: Arial, sans-serif;} td, th {border-bottom: 3px solid #4CAF50; padding: 10px; background-color: #E8F5E9; font-weight: bold;} tr:nth-child(even) {background-color: #F9FBE7;} div {width: 20px; height: 20px;}</style></head><body>');
          myWindow.document.write(document.getElementById("varToPopup").innerHTML);
          myWindow.document.write('</body></html>');
          myWindow.document.close();
      }

function parseVCF(outFile, curChr) {

    let downloadname = outFile.split('/').pop();

    highlightTab('Voutput');

    let currentPage = 1;

    let headers = [];
    let first_header = true;
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    fetch(outFile)
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                const infoDiv = document.getElementById('outHeader');
                $('#loadingContainer').html('');
                $('#loadingContainer').css('display', 'none');
                infoDiv.innerHTML = 'The query returned no results.  Change the options and try again.';


                const noDiv = document.getElementById('nonPage');
                noDiv.innerHTML = '';

                console.log("URL does not exist:", url);
                throw new Error('HTTP error, status = ' + response.status);
            }
        })
        .then(content => {
                $('#outHeader').html(`
                    <div>
                        <button class="popup-button" onclick="downloadFile('${outFile}')">Download the VCF file</button>
                        <button class="popup-button" onclick="openPopupM()">View the MaizeGDB2024 accession key</button>
                        <button class="popup-button" onclick="openPopupS()">View the Schnable2023 accession key</button>
                        <button class="popup-button" onclick="allelePopup()">View the allele key</button>
                        <button class="popup-button" onclick="varPopup()">View common variant effect types</button>
                    </div><br><br>
                `);

                const lines = content.split('\n');
                const chunks = [];
                for (let i = 0; i < lines.length; i += rowsPerPage) {
                  chunks.push(lines.slice(i, i + rowsPerPage));
                }
                renderPage(chunks, 1, "page"); // Render the first page
                createPaginationControls(chunks.length, chunks); // Create pagination controls
        })
        .catch(error => {
            console.error('Error fetching the VCF file:', error);
        });

    function isEllipsisApplied(element) {
        return element.scrollWidth > element.clientWidth;
    }

    let tooltipTimeout;

    // Function to show the tooltip
    function showTooltip(event) {
        // Clear any existing timeout to prevent delayed display from previous hover
        clearTimeout(tooltipTimeout);

        // Capture the necessary data before the delay
        const efValue = event.currentTarget.dataset.tooltiptext;
        const mouseX = event.pageX; // Use pageX instead of clientX
        const mouseY = event.pageY; // Use pageY instead of clientY

        // Set a timeout for the tooltip display
        tooltipTimeout = setTimeout(() => {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.innerHTML = efValue;
            tooltip.style.left = mouseX + 'px';
            tooltip.style.top = mouseY + 'px';
            document.body.appendChild(tooltip);
        }, 100); // Delay in milliseconds
    }

    function hideTooltip() {
        clearTimeout(tooltipTimeout);
        const existingTooltip = document.querySelector('.custom-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
    }

    // CSS class application based on genotype
    function getGenotypeClass(genotype) {
      switch (genotype.trim()) {
        case '0/0': return 'gt-0-0';
        case '0/1': case '1/0': return 'gt-0-1';
        case '1/1': return 'gt-1-1';
        case './.': return 'gt-dot-dot';
        default: return 'gt-other';
      }
    }

    function renderPage(chunks, page, check) {
      const table = document.getElementById('vcfTable');
      table.innerHTML = ''; // Clear the table

      if(check == "back")
      {
          if (current_page > 1)
          {
            page = current_page - 1;
          } else {
            page = 1;
          }
      }

      if(check == "forward")
      {
          if (current_page < max_page)
          {
            page = current_page + 1;
          } else {
            page = max_page;
          }
      }

      current_page = page;

      if(page > 1)
      {
          thead.appendChild(headerRow);
          table.appendChild(thead);
      }

      let posFirst = 0;
      let posLast = 0;
      let posChr = "";
      let posStart = 0;

      // Render only the chunk corresponding to the current page
      const currentChunk = chunks[page - 1];
      currentChunk.forEach((line, index) => {
        if (line.startsWith('#CHROM')) {
        if(first_header)
        {
          headers = line.split('\t');
          headers.forEach((header, headerIndex) => {
              if(headerIndex == 1 )
              {
                  const th01 = document.createElement('th');
                  th01.innerHTML = "CHR";
                  th01.className = 'th3'; // Assign the class
                  headerRow.appendChild(th01);

                  const th02 = document.createElement('th');
                  th02.innerHTML = "POS";
                  th02.className = 'th4'; // Assign the class
                  headerRow.appendChild(th02);

                  const th03 = document.createElement('th');
                  th03.innerHTML = "REF";
                  th03.className = 'th3'; // Assign the class
                  headerRow.appendChild(th03);

                  const th04 = document.createElement('th');
                  th04.innerHTML = "ALT";
                  th04.className = 'th3'; // Assign the class
                  headerRow.appendChild(th04);

                  const th1 = document.createElement('th');
                  th1.innerHTML = "Gene model(s)";
                  th1.className = 'th2'; // Assign the class
                  headerRow.appendChild(th1);

                  const th2 = document.createElement('th');
                  th2.innerHTML = "Effect type";
                  th2.className = 'th2'; // Assign the class
                  headerRow.appendChild(th2);

                  const th3 = document.createElement('th');
                  th3.innerHTML = "Effect impact";
                  th3.className = 'th2'; // Assign the class
                  headerRow.appendChild(th3);

                  const th4 = document.createElement('th');
                  th4.innerHTML = "MQ";
                  th4.className = 'th3'; // Assign the class
                  headerRow.appendChild(th4);

                  const th5 = document.createElement('th');
                  th5.innerHTML = "COMP";
                  th5.className = 'th3'; // Assign the class
                  headerRow.appendChild(th5);

                  const th7 = document.createElement('th');
                  th7.innerHTML = "max R2";
                  th7.className = 'th3'; // Assign the class
                  headerRow.appendChild(th7);
              } else if(headerIndex > 8) {
                  const th = document.createElement('th');
                    //th.innerHTML = header.replace(/_/g, '<span class="vertical-text"> </span>').replace(/#/g, '');

                    //let underscoreCount = (header.split('_').length - 1);
                    let header_split = header.split('_');
                    if (dataset == "maizegdb")
                    {
                        header_print = header_split.slice(0, -1).join('_');
                    } else {
                        header_print = header;
                    }
                    //header_print = header_split[0];

                    switch(header_print) {
                        case "SAMEA111391303":
                            header_print = "S68911";
                            break;
                        case "SAMEA111405059":
                            header_print = "YU796NS";
                            break;
                        case "SAMEA111405048":
                            header_print = "VA52";
                            break;
                        case "SAMEA111405058":
                            header_print = "YONG28";
                            break;
                        case "SAMEA111405051":
                            header_print = "W802G";
                            break;
                        case "SAMEA111405055":
                            header_print = "YE4";
                            break;
                        case "SAMEA111405029":
                            header_print = "PHWRZ";
                            break;
                        case "SAMEA111405008":
                            header_print = "PHAW6";
                            break;
                        case "SAMEA111404999":
                            header_print = "OQ101";
                            break;
                        case "SAMEA111405002":
                            header_print = "PA392";
                            break;
                        case "SAMEA111404998":
                            header_print = "OH3167B";
                            break;
                        case "SAMEA111404994":
                            header_print = "NP87";
                            break;
                        case "SAMEA111404979":
                            header_print = "ND167";
                            break;
                        case "SAMEA111404980":
                            header_print = "ND230";
                            break;
                        case "SAMEA111404973":
                            header_print = "N534";
                            break;
                        case "SAMEA111404959":
                            header_print = "MO23W";
                            break;
                        case "SAMEA111404956":
                            header_print = "MO13";
                            break;
                        case "SAMEA111404955":
                            header_print = "LP1NRHT";
                            break;
                        case "SAMEA111404945":
                            header_print = "LH212HT";
                            break;
                        case "SAMEA111404946":
                            header_print = "LH217";
                            break;
                        case "SAMEA111404939":
                            header_print = "LH175";
                            break;
                        case "SAMEA111404942":
                            header_print = "LH188";
                            break;
                        case "SAMEA111404933":
                            header_print = "L289";
                            break;
                        case "SAMEA111404920":
                            header_print = "IL778D";
                            break;
                        case "SAMEA111404922":
                            header_print = "INBRED_109";
                            break;
                        case "SAMEA111404910":
                            header_print = "HI28";
                            break;
                        case "SAMEA111404887":
                            header_print = "DK6F545";
                            break;
                        case "SAMEA111404879":
                            header_print = "CO236";
                            break;
                        case "SAMEA111404912":
                            header_print = "IA453";
                            break;
                        case "SAMEA111404883":
                            header_print = "CQ806";
                            break;
                        case "SAMEA111404884":
                            header_print = "CS608";
                            break;
                        case "SAMEA111404871":
                            header_print = "CL27";
                            break;
                        case "SAMEA111404857":
                            header_print = "B91";
                            break;
                        case "SAMEA111404851":
                            header_print = "B101";
                            break;
                        case "SAMEA111404850":
                            header_print = "AR228";
                            break;
                        case "SAMEA111404829":
                            header_print = "4554_INBRED";
                            break;
                        default:
                            // If none of the cases match, this block will be executed
                            // header_print remains unchanged or you can handle it differently
                            break;
                    }

                    //NEED TO FIX names with _
                    th.innerHTML = '<span class="vertical-text"> ' + header_print + '</span>';

                    //header = header.replace(/@/g, '_');

                    if(header_array[header])
                    {
                        th.className = 'th0_' + header_array[header];
                    } else {
                        //th.innerHTML = '<span class="vertical-text"> ' + header_print + '</span>';
                        th.className = 'th0';
                    }

                    headerRow.appendChild(th);
              }

          });
          first_header = false;
      }

          thead.appendChild(headerRow);
          table.appendChild(thead);
      } else if (!line.startsWith('#') && line.length > 1) {
          const rowData = line.split('\t');
          const row = document.createElement('tr');

          let ref = 'N';
          let alt = 'N';
          let multi = false;
          let alleles = [];
          let pos_val = 0;
          let chrom = "chr10"
          rowData.forEach((cell, cellIndex) => {
            const td = document.createElement('td');
            td.className = 'td1'; // Assign the class

            if(cellIndex == 0)
            {
                chrom = cell;
                cell = cell.replace(/chr/g, '');
                posChr = "Chr" + cell;
            }

            if(cellIndex == 1)
            {
                td.className = 'td4';
                pos_val = cell;

                if(posFirst == 0)
                {
                    posFirst = pos_val;
                    posStart= pos_val;
                } else {
                    const pd = document.getElementById('pageData');
                    pd.innerHTML = "Page " + page + ": Viewing loci for the region " + posChr + ":" + posStart + ".." + pos_val;

                    const pdB = document.getElementById('pageDataB');
                    pdB.innerHTML = "Page " + page + ": Viewing loci for the region " + posChr + ":" + posStart + ".." + pos_val;
                }
            }

            if(cellIndex == 3)
            {
                ref = cell
                td.className = 'td_allele';
            }

            if(cellIndex == 4)
            {
                  alt = cell
                  let parts = cell.split(",");
                  alleles[0] = ref;
                  parts.forEach((element, index) => {
                    alleles[index+1] = element;
                  });
                  td.className = 'td_allele';
            }

            if(cellIndex == 7)
            {
                // Extracting the gene model names (GM)
                let geneModelMatch = cell.match(/GENEMODEL=([^\t]*?)(?:SUB=|\t|$)/);
                let GM = '';

                if (geneModelMatch && geneModelMatch.length > 1) {
                    // Extract the gene model part and split by semicolon
                    GM = geneModelMatch[1].split(/[;,]+/).join('<br>');
                    GM2 = geneModelMatch[1].split(/[;,]+/).join('\n');
                }

                let FTMatch = cell.match(/TYPE=([^\t]*?)(?:EFFECT=|\t|$)/);
                let FT = '';

                if (FTMatch && FTMatch.length > 1) {
                    // Extract the gene model part and split by semicolon
                    FT = FTMatch[1].split(/[;,]+/).join('<br>');
                    FT2 = FTMatch[1].split(/[;,]+/).join('\n');
                }
                FT = FT.replace(/_/g, ' ');
                FT2 = FT2.replace(/_/g, ' ');

                let EFMatch = cell.match(/EFFECT=([^\t]*?)(?:GENEMODEL=|\t|$)/);
                let EF = '';

                if (EFMatch && EFMatch.length > 1) {
                    // Extract the gene model part and split by semicolon
                    EF = EFMatch[1].split(/[;,]+/).join('<br>');
                }
                EF = EF.replace(/_/g, ' ');

                // Extracting the mapping quality
                let MQ = cell.match(/MQ=([^;]+)/)[1].replace(/,/g, '<br>');

                // Extracting the coverage percent
                let CVP = cell.match(/CVP=([^;]+)/)[1].replace(/,/g, '<br>');

                // Extracting the maxr2
                let match = cell.match(/MAXR2=([^;]+)/);
                let R2 = match ? match[1].replace(/,/g, '<br>') : 'NA';
                let R2_val = 0;
                if (R2 != "NA") {
                    R2_val = parseFloat(R2).toFixed(2);
                } else {
                    R2_val = "NA";
                }

                let SUBMatch = cell.match(/SUB=([^\t]*?)(?:MAXR2=|\t|$)/);
                let SUB = '';

                if (SUBMatch && SUBMatch.length > 1) {
                    // Extract the gene model part and split by semicolon
                    SUB = SUBMatch[1].split(/[;,]+/).join('<br>');
                    SUB2 = SUBMatch[1].split(/[;,]+/).join('\n');
                }
                SUB = SUB.replace(/_/g, ' ');
                SUB2 = SUB2.replace(/_/g, ' ');

                cell = "Genotype (GT)"

                let upper = parseInt(pos_val) + 10000;
                let lower = parseInt(pos_val) - 10000;

                let link = "https://jbrowse.maizegdb.org/index.html?data=B73&loc=" + chrom + ":" + lower + ".." + upper + "&highlight=" + chrom + ":" + pos_val + ".." + pos_val;

                const td1 = document.createElement('td');
                td1.innerHTML = "<a target='_blank' href='" + link + "'>" + GM + "</a>";
                td1.className = 'td2'; // Assign the class
                td1.dataset.tooltiptext = GM; // Store the EF value in a data attribute
                row.appendChild(td1);

                const td2 = document.createElement('td');

                var FTArray = FT2.split("\n");
                var GMArray = GM2.split("\n");
                var SUBArray = SUB2.split("\n");

                // Initialize an empty string to hold the resulting HTML
                var htmlResult = "";

                // Loop through the FTArray to find "missense" occurrences
                var first_hit = true;
                FTArray.forEach(function(ftElement, index) {
                  if (ftElement.includes("missense")) {
                    // When "missense" is found, use the corresponding GM value to create a link
                    var gmValue = GMArray[index];
                    var subValue = SUBArray[index];
                    var link = "http://www.maizegdb.org/effect/maize/index.html?id=" + gmValue;
                    // Append the link HTML to the htmlResult string
                    if(first_hit)
                    {
                       htmlResult += `(${subValue}) <a href="${link}" target="_blank">${ftElement}</a>`;
                       first_hit = false;
                    } else {
                        htmlResult += `<br>(${subValue}) <a href="${link}" target="_blank">${ftElement}</a>`;
                    }

                } else if (ftElement.includes("synonymous")) {
                  // When "missense" is found, use the corresponding GM value to create a link
                  var subValue = SUBArray[index];
                  // Append the link HTML to the htmlResult string
                  if(first_hit)
                  {
                     htmlResult += `(${subValue}) ${ftElement}`;
                     first_hit = false;
                  } else {
                      htmlResult += `<br>(${subValue}) ${ftElement}`;
                  }

              } else {
                    if(first_hit)
                    {
                        htmlResult += `${ftElement}`;
                        first_hit = false;
                    } else {
                        htmlResult += `<br>${ftElement}`;
                    }

                }
                });

                td2.innerHTML = htmlResult ;
                td2.className = 'td5'; // Assign the class
                td2.dataset.tooltiptext = FT;
                row.appendChild(td2);

                const td3 = document.createElement('td');
                td3.innerHTML = EF;
                if(EF.includes("HIGH")) {
                    td3.className = 'td_high'; // Assign the class
                } else if(EF.includes("MODERATE")) {
                    td3.className = 'td_medium'; // Assign the class
                } else if(EF.includes("LOW")) {
                    td3.className = 'td_low'; // Assign the class
                } else {
                    td3.className = 'td_modifier'; // Assign the class
                }

                td3.dataset.tooltiptext = EF;
                row.appendChild(td3);

                const td4 = document.createElement('td');
                //td4.innerHTML = Math.round(parseFloat(MQ));
                if (!MQ || isNaN(parseFloat(MQ))) {
                    td4.innerHTML = "NA";
                } else {
                    td4.innerHTML = Math.round(parseFloat(MQ));
                }
                td4.className = 'td3'; // Assign the class
                row.appendChild(td4);

                const td6 = document.createElement('td');
                //td6.innerHTML = Math.round(parseFloat(CVP));
                if (!CVP || isNaN(parseFloat(CVP))) {
                    td6.innerHTML = "NA";
                } else {
                    td6.innerHTML = Math.round(parseFloat(CVP));
                }
                td6.className = 'td3'; // Assign the class
                row.appendChild(td6);

                const td7 = document.createElement('td');
                td7.innerHTML = R2_val;
                td7.className = 'td3'; // Assign the class
                row.appendChild(td7);
            }

            if(cellIndex == 8)
            {
                cell = "Genotype (GT)"
            }

            if(cellIndex == 2 || cellIndex == 5 || cellIndex == 6 || cellIndex == 7 || cellIndex == 8)
            {
                //do nothing
            } else {

                if (cellIndex >= 9) { // Genotype columns
                  const genotype = cell.trim(); // Trim whitespace from genotype
                  td.className = getGenotypeClass(genotype); // Use the trimmed genotype here

                  let cell_mod = 'N';
                    switch (genotype) {
                      case '0/0':
                        cell_mod = '0'
                        break;
                      case '0/1':
                        cell_mod = '1';
                        break;
                      case '1/0':
                        cell_mod = '1';
                        break;
                      case '1/1':
                        cell_mod = '2';
                        break;
                      case './.':
                        cell_mod = 'N';
                        break;
                      default:
                        cell_mod = cell;
                        break;
                    }

                  td.textContent = cell_mod;
                  row.appendChild(td);

              } else {
                  td.textContent = cell;
                  if(cellIndex == 3 || cellIndex == 4)
                  {
                    td.className = 'td_allele';
                    td.dataset.tooltiptext = cell;
                } else if(cellIndex == 1)
                  {
                    td.className = 'td4';
                  } else {
                    td.className = 'td3';
                  }

                  row.appendChild(td);
              }
            }
          });

          table.appendChild(row);

        }
      });

      const tdElements = document.querySelectorAll('td'); // Select all td elements
          tdElements.forEach(td => {
              if (isEllipsisApplied(td)) {
                  td.addEventListener('mouseover', showTooltip);
                  td.addEventListener('mouseout', hideTooltip);
              }
          });
          $('#loadingContainer').css('display', 'none');
    }

    function createPaginationControls(numPages, chunks) {
      const paginationDiv = document.getElementById('pagination');
      paginationDiv.innerHTML = ''; // Clear existing controls

      const paginationDivBottom = document.getElementById('paginationBottom');
      paginationDivBottom .innerHTML = ''; // Clear existing controls

      const pageButton2 = document.createElement('button');
      pageButton2.innerText = "<<";
      pageButton2.addEventListener('click', function() {
        renderPage(chunks, current_page, "back");
      });

      const pageButtonBottom2 = document.createElement('button');
      pageButtonBottom2.innerText = "<<";
      pageButtonBottom2.addEventListener('click', function() {

        renderPage(chunks, current_page, "back");
      });
      paginationDiv.appendChild(pageButton2);
      paginationDivBottom.appendChild(pageButtonBottom2);

      for (let i = 1; i <= numPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.addEventListener('click', function() {
          currentPage = i;
          renderPage(chunks, i, "page");
        });

        const pageButtonBottom = document.createElement('button');
        pageButtonBottom.innerText = i;
        pageButtonBottom.addEventListener('click', function() {
          currentPage = i;
          renderPage(chunks, i, "page");
        });
        paginationDiv.appendChild(pageButton);
        paginationDivBottom.appendChild(pageButtonBottom);

        max_page = i;
      }

      const pageButton3 = document.createElement('button');
      pageButton3.innerText = ">>";
      pageButton3.addEventListener('click', function() {
        renderPage(chunks, current_page, "forward");
      });

      const pageButtonBottom3 = document.createElement('button');
      pageButtonBottom3.innerText = ">>";
      pageButtonBottom3.addEventListener('click', function() {

        renderPage(chunks, current_page, "forward");
      });
      paginationDiv.appendChild(pageButton3);
      paginationDivBottom.appendChild(pageButtonBottom3);
    }

}

// namespace variables
(function(){
  // classes used in your HTML
  var dropDownClass = 'dropdown-content';
  var showClass = 'show';
  var dropDowns = document.getElementsByClassName('dropdown');

  // this function will be called on click
  var open = function(e){
      var openDropDown = e.target.nextElementSibling;
      var dropdowns = document.getElementsByClassName(dropDownClass);

      openDropDown.classList.toggle(showClass);

      var closeDropDown = function(event) {
          if (event.target === e.target) {
              return;
          }
          if (openDropDown.classList.contains(showClass)) {
              openDropDown.classList.remove(showClass);
          }
          window.removeEventListener('click', closeDropDown);
      };
      window.addEventListener('click', closeDropDown);
  }

  for(var i = 0; i < dropDowns.length; i++){
      dropDowns[i].children[0].addEventListener('click', open);
  }
}());


function toggleNAM() {
  // Get all checkboxes within this table with the class 'genotypes'
  var checkboxes = document.querySelectorAll('.genotypes');

  // First, uncheck all checkboxes
  checkboxes.forEach(function(checkbox) {
    //checkbox.checked = false;

    // List of checkbox values to be checked
    //const valuesToCheck = ["B97_CRX445264","CML52_SRR5725841","CML69_SRR8906963","CML103_SRR5976229","CML228_SRR8906784","CML322_CRX445267","CML333_CRX445268","M37W_SRR5976317"];
    const valuesToCheck = ["B73_ERS3371164","B73Ab10_ERS4036196","B97_ERS3120542","CML103_ERS3120545","CML228_ERS3120546","CML247_ERS3120547","CML277_ERS3120548","CML322_ERS3120549","CML333_ERS3120550","CML52_ERS3120543","CML69_ERS3120544","Hp301_ERS3120551","Il14H_ERS3120552","Ki11_ERS3120554","Ki3_ERS3120553","Ky21_ERS3120555","M162W_ERS3120556","M37W_ERS3120557","Mo18W_ERS3120558","MS71_ERS3120559","NC350_ERS3120560","NC358_ERS3120561","Oh43_ERS3120562","Oh7B_ERS3120563","P39_ERS3120564","Tx303_ERS3120565","Tzi8_ERS3120566"];

    // Check the checkbox if its value is in the 'valuesToCheck' array
    if (valuesToCheck.includes(checkbox.value)) {
      checkbox.checked = true;
    }

  });
}


function toggleCheckboxesAll(perc, genotype_val) {
  // Find the parent table of the "Select All" checkbox
  //var table = source.closest('table');
  // Get all checkboxes within this table with the class 'genotypes'
  var checkboxes = document.querySelectorAll(genotype_val);

  // First, uncheck all checkboxes
  checkboxes.forEach(function(checkbox) {
      checkbox.checked = false
  });

  // Calculate 25% of the total number of checkboxes
  var countToCheck = Math.ceil(checkboxes.length * perc);

  // Create an array of indexes and shuffle it
  var indexes = Array.from(Array(checkboxes.length).keys());
  shuffleArray(indexes);

  // Check the first 25% of the shuffled indexes
  for (var i = 0; i < countToCheck; i++) {
      checkboxes[indexes[i]].checked = true;
  }
}

function toggleCheckboxes(source, perc, genotype_val) {
  // Find the parent table of the "Select All" checkbox
  var table = source.closest('table');
  // Get all checkboxes within this table with the class 'genotypes'
  var checkboxes = table.querySelectorAll(genotype_val);

  // First, uncheck all checkboxes
  checkboxes.forEach(function(checkbox) {
      checkbox.checked = false;
  });

  // Calculate 25% of the total number of checkboxes
  var countToCheck = Math.ceil(checkboxes.length * perc);

  // Create an array of indexes and shuffle it
  var indexes = Array.from(Array(checkboxes.length).keys());
  shuffleArray(indexes);

  // Check the first 25% of the shuffled indexes
  for (var i = 0; i < countToCheck; i++) {
      checkboxes[indexes[i]].checked = true;
  }
}

// Utility function to shuffle an array
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

function loadExample() {
  // Define an array of strings
  var geneModels = [
      "Zm00001eb404760",
      "Zm00001eb404740",
      "Zm00001eb404780",
      "Zm00001eb404830"
  ];

  // Get a random index from the array (from 0 to array length - 1)
  var randomIndex = Math.floor(Math.random() * geneModels.length);

  // Select a random gene model from the array
  var selectedGeneModel = geneModels[randomIndex];

  // Set the value of the element with ID 'geneModelId'
  document.getElementById('geneModelId').value = selectedGeneModel;
}

function loadGeneModelData() {
  var geneModelId = document.getElementById('geneModelId').value;

  if(geneModelId) {
      // Create an AJAX request
      var xhr = new XMLHttpRequest();
      xhr.open('GET', './lookupGeneModel.php?geneModelId=' + geneModelId, true);
      xhr.onload = function() {
          if (this.status == 200) {
              var data = JSON.parse(this.responseText);
              if (data.id == 'empty')
              {
                  document.getElementById('error').innerHTML = "<font color='red'>Gene Model ID not found.</font>";
              } else {
                  document.getElementById('error').innerHTML = "<font color='green'>Gene Model ID found.</font>";
                  var currentValue = parseInt(document.getElementById("flankInput").value, 0);

                  let newstart = parseInt(data.start) - currentValue;
                  let newend = parseInt(data.end) + currentValue;

                  if (newstart < 0)
                  {
                      newstart = 0;
                  }

                  document.getElementById('chrInput').value = data.chromosome;
                  document.getElementById('startInput').value = newstart;
                  document.getElementById('endInput').value = newend;
              }
          }
      };
      xhr.send();
  }
}
