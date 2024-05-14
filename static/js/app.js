// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data){

    // Convert sample to an int
    let sampleInt = parseInt(sample);

    // get the metadata field
    let metaData = data['metadata'];
  
    // Filter the metadata for the object with the desired sample number
    let filteredMetaData = metaData.filter(function(obj){
      return obj['id'] === sampleInt
    });
    console.log(filteredMetaData)
    // Use d3 to select the panel with id of `#sample-metadata`
    let sampleMetaData = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    sampleMetaData.html('');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    filteredMetaData.forEach(function(item){
      for (let key in item){
        sampleMetaData.append('p').text(`${key.toUpperCase()}: ${item[key]}`);
      }
    });
  });
}


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data){

  // Convert sample to a string
  var sampleString = sample.toString();


    // Get the samples field
    var sampleData = data['samples']

    // Filter the samples for the object with the desired sample number
    var filteredSampleData = sampleData.filter(function(obj){
      return obj['id'] === sampleString
    })
    
    // Get the otu_ids, otu_labels, and sample_values
    var otuIds = filteredSampleData[0]['otu_ids']
    var otuLabels = filteredSampleData[0]['otu_labels']
    var sampleValues = filteredSampleData[0]['sample_values']
    
    // Build a Bubble Chart
    var trace = {
      'x': otuIds,
      'y':sampleValues,
      'mode': 'markers',
      'marker': {
        'color': otuIds,
        'colorscale': 'Portland',
        'size': sampleValues*2
      },
      'text': otuLabels
    };
    var data = [trace];

    var layout = {
      'title':'Bacteria Cultures Per Sample',
      xaxis: {
        title: 'OTU IDs' 
    },
    yaxis: {
        title: 'Number of Bacteria' 
    }
    }


    // Render the Bubble Chart
    Plotly.newPlot('bubble',data,layout)

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var otuIdsStrings = otuIds.map(function(ids){
      return "OTU " + ids.toString();
    })

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    var trace1 = {
      'x' : sampleValues.slice(0,10).reverse(),
      'y' : otuIdsStrings.slice(0,10).reverse(),
      'type':'bar',
      'orientation': 'h',
      'hovertext': otuLabels.slice(0,10).reverse(),
      'marker':{
        'color':otuIds,
        'colorscale': 'Portland'
      }

    }
    var data1 = [trace1]
    var layout = {
      'title': 'Top 10 Bacteria Cultures Found'
    }
    // Render the Bar Chart
    Plotly.newPlot('bar',data1,layout)

  });
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function (data) {


    // Get the names field
    var names = data['names'];

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(function (name) {
      dropdown.append("option")
              .text(name)
              .attr("value", name);
  });

  // Get the first sample from the list
  var firstSample = names[0];

  // Build charts and metadata panel with the first sample
  buildCharts(firstSample);
  buildMetadata(firstSample);


  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample)
}

// Initialize the dashboard
init();
