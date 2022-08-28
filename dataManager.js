
function enterData(){

}


function updateScoreChart(ctx, score){
    scores.push(score)
    label.push(label.length + 1)
    chart.data.datasets[0].data = scores
    chart.data.labels = label 
    chart.options.plugins.title.text = 'mFactor:' + mutateAmount + '_sensorCount:' + sensorCount + '_spread:' + spread + '_traffic:' + trafficCount
    chart.update()
}


function storeChartImage(){
    // # Or write to disk...
    var a = document.createElement('a');
    a.href = chart.toBase64Image();
    a.download = 'mFactor:'+ mutateAmount + '_sCount:'+ sensorCount + '_spred:' + spread +'_traffic:' +trafficCount+ '_generations:' + generation + 'Chart.png';

    // Trigger the download
    a.click();
}