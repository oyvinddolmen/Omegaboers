

document.addEventListener('DOMContentLoaded', function() {

    // henter elementene fra HTML dokumentet
    const graphSelector = document.getElementById('graph-selector');
    const graphCanvas = document.getElementById('graph');
    const ctx = graphCanvas.getContext('2d');
    const weeklyChangeElement = document.getElementById('weekly-change');
    const monthlyChangeElement = document.getElementById('monthly-change');
    const ukeVinnerImg = document.getElementById("ukens-vinner-img");
    

    // dictionary med aksjekurs for hver uke for de ulike komiteene lagret i en array
    // OBS! navnene på komiteene må være identiske i graphData og ukentligEndring
    const graphData = {
        "PhinansCommiteen": [100, 106.2, 109, 113, 108, 106.4, 106, 105, 105.4, 106.1, 106.6, 105.9, 101.1, 103, 102],
        "HeutteCommiteen": [100, 97.4, 98, 98.3, 97.7, 99, 97, 98, 99.3, 101, 104, 104.3, 105, 104.8, 106],
        "LocomotivCommiteen": [100, 94.6, 95, 95.4, 94, 96, 98, 99, 100.2, 102, 101, 102.3, 103.1, 102, 104],
        "Contactor": [100, 100.7, 99, 98.5, 98, 103, 111, 117, 123, 129.1, 141, 152, 151, 157, 155.2],
        "PhaestCommiteen": [100, 98.7, 99, 100.5, 96, 97, 105, 106, 107, 106.2, 107.3, 107, 107.5, 104, 105.3],
        "Sport og Spill": [100, 111.2, 110, 117, 125, 131, 136, 140, 146, 143, 155.4, 162, 166, 172, 169.3],
        "LophtCommiteen": [100, 101.2, 102, 102.3, 108, 109, 110, 117, 116, 116.3, 118.1, 122, 127, 126, 127.8],
        "SosialCommiteen": [100, 99.7, 100.8, 101, 104, 110, 113, 114, 119, 118, 119.7, 120, 119.4, 116.3, 115.5],
        "Hovedstyret": [100, 100.6, 101.4, 103, 107, 106.4, 106, 108, 109, 111, 113.2, 112.8, 120, 121, 122.1],
        "Vevcom": [100, 99.6, 99.1, 100.1, 99.2, 97, 96, 96.5, 98, 99, 104, 104.7, 105.6, 106, 107],
        "OmBul": [100, 101.3, 101.5, 102, 110, 109.4, 118, 117, 117.8, 116.3, 115.3, 122.2, 123, 122.4, 123.2],
        "Kielder": [100, 101.2, 101.3, 100.7, 104.6, 102, 106, 112, 111, 118, 123.1, 122.5, 123.2, 122, 121.6],
        "OmegaBand": [100, 99.8, 99, 99.7, 98.3, 98, 99, 101, 104, 105, 105.4, 111, 111.6, 112, 113.8],
        "Dei Taktlause": [100, 101.6, 102, 102.3, 100.8, 105, 104, 104.3, 108, 109, 108.3, 110.1, 111.1, 112, 113.2],
        "Omega Verksted": [100, 100.2, 101, 101.2, 103, 104, 106, 105.5, 105.3, 106, 114, 113.2, 112.3, 113.4, 113],
        "HaandbryggerCommiteen": [100, 99, 98.5, 107, 106.2, 107.1, 106, 110, 111, 110.2, 116, 116.3, 117.2, 116.4, 116.1],
        "BlaesteCommiteen": [100, 104, 105.6, 105, 101, 101.1, 123, 124, 122, 121.2, 128, 127.4, 128, 126.5, 125.8],
        "Omegarevyen": [100, 99.5, 104, 105, 106, 106.3, 107, 108, 109, 110, 150, 149.3, 149, 148.4, 157.2],
        "Mikrokortrollene": [100, 99.1, 98.6, 10.2, 9, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "Det Gamle Raad": [100, 100.8, 101.2, 100.5, 102, 103, 102.3, 103.1, 104, 107, 108, 107.5, 107.2, 108.3, 110],
        "Fadderstyret": [100, 103, 102.6, 102, 99, 101, 102, 100, 99, 98, 99, 99.3, 99.4, 98.9, 99.2],
    };

    const ukentligEndring = {
        "PhinansCommiteen": 0,
        "HeutteCommiteen": 0,
        "LocomotivCommiteen": 0,
        "Contactor": 0,
        "PhaestCommiteen": 0,
        "Sport og Spill": 0,
        "LophtCommiteen": 0,
        "SosialCommiteen": 0,
        "Hovedstyret": 0,
        "Vevcom": 0,
        "OmBul": 0,
        "Kielder": 0,
        "OmegaBand": 0,
        "Dei Taktlause": 0,
        "Omega Verksted": 0,
        "HaandbryggerCommiteen":0 ,
        "BlaesteCommiteen": 0,
        "Omegarevyen": 0,
        "Mikrokortrollene": 0, 
        "Det Gamle Raad": 0,
        "Fadderstyret": 0,
    }

    const selectedGraph = graphSelector.value;              // value til grafen som er valgt


    /* --------------------------------------- funksjoner ----------------------------------- */
    // ukentlig prosentvisøkning
    function ukentligØkning(selectedGraph) {

        var komiteAksjeArray = graphData[selectedGraph];
        var sisteVerdi = komiteAksjeArray[komiteAksjeArray.length - 1];
        var nestSisteVerdi = komiteAksjeArray[komiteAksjeArray.length - 2];

        // fjerner infinity
        if (nestSisteVerdi == 0) {
            nestSisteVerdi = sisteVerdi;
        }

        var weeklyChange = (sisteVerdi - nestSisteVerdi) / nestSisteVerdi * 100;
        
        if (nestSisteVerdi == 0) {
            weeklyChange = 0;
        }

        // hvis økning --> grønn. Hvis ingen endring --> svart. Endrer kun "informasjon" under grafen
        if (weeklyChange > 0) {
            weeklyChangeElement.style.color = "green";    
        } else if (weeklyChange < 0) {
            weeklyChangeElement.style.color = "red";   
        } else {
            weeklyChangeElement.style.color = "black";
        }

        // returner Int eller float med 1 desimal
        if (Number.isInteger(weeklyChange)) {
            return weeklyChange;
        } else {
            return weeklyChange.toFixed(1);
        }
    }

    function månedligØkning(selectedGraph) {
        var komiteAksjeArray = graphData[selectedGraph];
        var sisteVerdi = komiteAksjeArray[komiteAksjeArray.length - 1];
        var forrigeMånedVerdi = komiteAksjeArray[komiteAksjeArray.length - 5];
        var monthlyChange = (sisteVerdi - forrigeMånedVerdi) / forrigeMånedVerdi * 100;

        // hvis økning --> grønn. Hvis ingen endring --> svart. Endrer kun "informasjon" under grafen
        if (monthlyChange > 0) {
            monthlyChangeElement.style.color = "green"    
        } else if (monthlyChange < 0) {
            monthlyChangeElement.style.color = "red"   
        } else {
            monthlyChangeElement.style.color = "black"
        }

        if (Number.isInteger(monthlyChange)) {
            return monthlyChange;
        } else {
            return monthlyChange.toFixed(1);
        } 
    }



    // oppretter et objekt "chart" til grafen og koordinatsystemet 
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Uke:     ', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '17'],         // labels for uke
            datasets: [{
                label: "",                                              // label til valgt graf
                data: graphData[selectedGraph],                         // aksesserer dictionary og henter ut array
                borderColor: 'rgb(75, 192, 192)',                       // fargen til selve grafen
                borderWidth: 3, 
                fill: "origin",                                         // fargen under grafen            
            }]
        },
        options: {
            scales: {
                y: {
                    // beginAtZero: true,                                  // bestemmer om verdiene på y-aksen begynner på 0
                    max: 170,                                               
                    min: 70, 
                }
            },
            legend: {
                labels: {
                  boxWidth: 0,
                }
            }
        }
    });
    


    // Oppdaterer informasjonen ukentlig og månedligendring 
    function updateInfo(selectedGraph) {

        const weeklyChange = ukentligØkning(selectedGraph)
        const monthlyChange = månedligØkning(selectedGraph)

        weeklyChangeElement.innerHTML = `${weeklyChange} %`;
        monthlyChangeElement.innerHTML = `${monthlyChange} %`;
    }


    // når endring på menyen av komiteer
    graphSelector.addEventListener('change', function() {
        var selectedGraph = graphSelector.value;

        chart.data.datasets[0].data = graphData[selectedGraph];             // henter data fra nye komiteen
        chart.data.datasets[0].label = ``;                                  // label med valgt graf. Nå tom siden value på komiteene har underscore. feks "spor_og_spill"

        chart.update();
        updateInfo(selectedGraph);                                          // oppdaterer informasjonen om aksjen
    });

    updateInfo(selectedGraph);                                              // oppdaterer informasjonen om aksjen(e)







    /* ------- ukens vinnere/tapere --------*/

    // må loope gjennom alle komitene og finne prosentvis endring fra nest siste til siste element
    // legger ukentligendring uten desimaler inn i objektet "ukentligendring"
    var ukeVinnerElement = document.getElementById("uke-vinner");
    var keys = Object.keys(ukentligEndring);
    var ukeVinner = ""; 
    var maxValue = -1000000
    for (var key of keys) {
        var økning = ukentligØkning(key);
        ukentligEndring[key] = økning + " %";


        var endring_uten_prosenttegn = parseFloat(ukentligEndring[key].slice(0, -1));           // fjerner prosenttegnet og gjør om til float
        if (endring_uten_prosenttegn > maxValue) {
            maxValue = endring_uten_prosenttegn;
            ukeVinner = key;
        }
    }

    ukeVinnerElement.innerHTML = ukeVinner + ": " + maxValue + " %";                 // skriver inn ukevinner i HTML



    var antallUker = graphData["PhaestCommiteen"].length;

    var tableBody = document.getElementById("ukentlig-endring-tabell").getElementsByTagName('tbody')[0];
    // loop igjennom ukentligEndring og legg til verdien i tabellen
    for (const komite in ukentligEndring) {
        var row = tableBody.insertRow();
   
        // Create cells in each row
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell2.className = "right-column"

        // setter inn verdi i kolonnene i raden
        cell1.textContent = komite;
        cell2.textContent = ukentligEndring[komite];
        cell3.textContent = graphData[komite][antallUker - 1]
    }

    





    



});


