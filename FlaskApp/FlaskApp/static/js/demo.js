//link to csv files
csvData = "../../data/minMaxAvg.csv"
csvData2 = "../../data/allData.csv"
csvData3 = "../../data/merged_stats.csv"

 ////////////////////////////////////////////////////////////////////////////

//check files are being pulled in correctly
array = d3.csv(csvData).then(function(data) {
  console.log("Array1 : ", data);
});

array2 = d3.csv(csvData2).then(function(data2) {
    console.log("Array 2: ", data2);
  });

array3 = d3.csv(csvData3).then(function(data3) {
    console.log("Array 3: ", data3);
  });  

 ////////////////////////////////////////////////////////////////////////////

 //initial load screen
function init() {

    let dropdownMenu = d3.select('#selDataset');

    d3.csv(csvData).then((data) => {

        for (let i = 0; i < data.length; i++) {
            let row = data[i];
            //add dates to dropdown list
            dropdownMenu.append('option').text(row.acq_date).property('value');
        };

        let selection = data[0].acq_date
        console.log("Made Selection", selection)

        //run functions for the initial load
        displayDetails(selection)

        //run static functions
        minMaxAvg();

    })    
};

////////////////////////////////////////////////////////////////////////////

//add line chart showing min/max/avg data
function minMaxAvg() {
    d3.csv(csvData).then((data) => {

        let date = [];
        let minimum = [];
        let maximum = [];
        let average = [];

        //populate arrays for plotting use
        for (let i = 0; i < data.length; i++) {
            let row = data[i];
            date.push(row.acq_date);
            minimum.push(row.min_brightness);
            maximum.push(row.max_brightness);
            average.push(row.average_brightness);            
        };
      
        //check arrays have populated correctly
      console.log("Date: ", date)
      console.log(minimum)
      console.log(maximum)
      console.log(average)

      //build trace dictionary for chart details and parameters, for each line item
        let traceMin = {
            x: date,
            y: minimum,
            name: "Minimum",
            type: 'line'
        };
        
        let traceMax = {
            x: date,
            y: maximum,
            name: 'Maximum',
            type: 'line'
        };
        
        let traceAvg = {
            x: date,
            y: average,
            name: 'Average',
            type: 'line'
        };
        
        //the data array for plotting
        let allData = [traceMax, traceAvg, traceMin];
        
        //chart layout parameters
        let layout = {
            yaxis: {title: {
                text: "Degrees Kelvin"
            }},
            title: {text: "<b>Brightness Temperature September to December 2019</b><br>Note: No Data Available for October</br>"},
            barmode: 'group',
            width: 900,
            height: 500
        };
        
        //plot line graph
        Plotly.newPlot('plot', allData, layout);  

    });
};

////////////////////////////////////////////////////////////////////////////

function displayDetails(selection){
    d3.csv(csvData3).then((data) => {
        //filter for selected value
        let info = data.filter(result => result.acq_date == selection);
        
        //using the filtered result
        let infoSelection = info[0]
        console.log("info selection: ", infoSelection)

        //define panel ready for contents addition
        let panel = d3.select('#sample-metadata').html('');

        //add the rows of the panel with information for the selected date
        let rowCount = panel.append('tr')
        rowCount.append('td').text('Number of readings: ')
        rowCount.append('td').text(infoSelection.reading_count)

        let rowMax = panel.append('tr')
        rowMax.append('td').text('Maximum Brightness (Kelvin): ')
        rowMax.append('td').text(infoSelection.max_brightness)

        let rowMin = panel.append('tr')
        rowMin.append('td').text('Minimum Brightness (Kelvin): ')
        rowMin.append('td').text(infoSelection.min_brightness)

        let rowAvg = panel.append('tr')
        rowAvg.append('td').text('Average Brightness (Kelvin): ')
        rowAvg.append('td').text(infoSelection.average_brightness)

        let rowVeg = panel.append('tr')
        rowVeg.append('td').text('Readings over Vegetation: ')
        rowVeg.append('td').text(infoSelection.vegetation)

        let rowOther = panel.append('tr')
        rowOther.append('td').text('Readings over other land: ')
        rowOther.append('td').text(infoSelection.other_land)

        let rowOffshore = panel.append('tr')
        rowOffshore.append('td').text('Readings offshore: ')
        rowOffshore.append('td').text(infoSelection.offshore)  

    })
};


////////////////////////////////////////////////////////////////////////////

//update page when new date selected
function optionChanged(choice){
    console.log(choice)

    //call functions to run with new selection
    displayDetails(choice);
    
};

////////////////////////////////////////////////////////////////////////////

//call initial function to create first view
init(); 