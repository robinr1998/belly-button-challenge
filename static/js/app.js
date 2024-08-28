// Function to build the metadata panel based on the selected Test Subject ID Number
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let metadata = data.metadata;
    let sampleMetadata = metadata.filter((meta) => meta.id == sample);
    let panel = d3.select("#sample-metadata");
    panel.html("");

    if (sampleMetadata.length === 0) {
      panel.append("p").text("No demographics data found for the selected sample.");
    } else {
      sampleMetadata.forEach((item) => {
        Object.entries(item).forEach(([key, value]) => {
          panel.append("p").text(`${key}: ${value}`);
        });
      });
    }
  });
}

// Function to build both charts
// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let sampleValues = data.samples.find(s => s.id === sample).sample_values;
    let otuIds = data.samples.find(s => s.id === sample).otu_ids;
    let otuLabels = data.samples.find(s => s.id === sample).otu_labels;

    // Build a Bubble Chart
    let titleBubble = "Bubble Chart of Bacteria Cultures";

    let trace2 = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Viridis'
      },
      text: otuLabels
    };

    let plotDataBubble = [trace2];

    let layoutBubble = {
      title: titleBubble,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" }
    };

    Plotly.newPlot("bubble", plotDataBubble, layoutBubble);

    // Build a Horizontal Bar Chart
    let titleBar = "Top 10 Bacteria Cultures Found";

    // Sort the sampleValues in descending order and select the top 10 values
    let sortedSampleValues = sampleValues.slice().sort((a, b) => b - a);
    let top10SampleValues = sortedSampleValues.slice(0, 10);

    // Get the corresponding OTU IDs for the top 10 sample values
    let top10OtuIds = [];
    let top10OtuLabels = [];
    top10SampleValues.forEach(value => {
      let index = sampleValues.indexOf(value);
      top10OtuIds.push(otuIds[index]);
      top10OtuLabels.push(otuLabels[index]);
    });

    // Format the top 10 OTU IDs as "OTU {id}" for display on the y-axis
    let formattedOtuIds = top10OtuIds.map(otuId => `OTU ${otuId}`).reverse();
    let bacteria = top10SampleValues.reverse();

    let trace1 = {
      x: bacteria,
      y: formattedOtuIds,
      type: 'bar',
      orientation: 'h',
      text: top10OtuLabels.reverse() // Set otu_labels as hover text
    };

    let plotDataBar = [trace1];

    let layoutBar = {
      title: titleBar
    };

    Plotly.newPlot("bar", plotDataBar, layoutBar);
  });
}

// Function to run on page load and populate the dropdown
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let sampleNames = data.names;
    let dropdown = d3.select("#selDataset");

    sampleNames.forEach(function(name) {
      dropdown.append("option").text(name).property("value", name);
    });

    // Call buildMetadata with the first sample ID initially
    buildMetadata(sampleNames[0]);
    buildCharts(sampleNames[0]); // Call buildCharts with the first sample ID initially
  });
}

// Event listener for dropdown change
d3.select("#selDataset").on("change", function() {
  let selectedSample = d3.select("#selDataset").property("value");
  buildMetadata(selectedSample);
  buildCharts(selectedSample); // Call buildCharts with the selected sample ID
});

// Define the optionChanged function to handle dropdown selection change
function optionChanged() {
  let selectedSample = d3.select("#selDataset").property("value");
  buildMetadata(selectedSample);
  buildCharts(selectedSample); // Call buildCharts with the selected sample ID
}

// Initialize the dashboard
init();