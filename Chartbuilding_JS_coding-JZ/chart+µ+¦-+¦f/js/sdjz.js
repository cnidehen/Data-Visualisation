
function getDate(data) {
    var map = {};
    for (i = 0; i < data.length; i++) {
        var key = data[i]
        if (map[key]) {
            map[key] += 1
        } else {
            map[key] = 1
        }
    }
    let keysSorted = Object.keys(map).sort();
    return keysSorted;
}


function plotScatterMatrix(rawData, dateList) {
    var myChart = echarts.init(document.getElementById('main'));

    //Define the gap size for each row and column
    var CATEGORY_DIM_COUNT = 7;
    var GAP = 1;
    var BASE_LEFT = 1;
    var BASE_TOP = 10;
    //define chart position
    var GRID_WIDTH = (100 - BASE_LEFT - GAP) / CATEGORY_DIM_COUNT - GAP;
    var GRID_HEIGHT = (100 - BASE_TOP - GAP) / CATEGORY_DIM_COUNT - GAP;
    //Defines the points in the scatterplot matrix
    var CATEGORY_DIM = 7;
    var SYMBOL_SIZE = 3;

    function retrieveScatterData(data, dimX, dimY) {
        var result = [];
        for (var i = 0; i < data.length; i++) {
            var item = [data[i][dimX], data[i][dimY]];
            item[CATEGORY_DIM] = data[i][CATEGORY_DIM];
            result.push(item);
        }
        return result;
    }

    function generateGrids(option) {
        var index = 0;

        for (var i = 0; i < CATEGORY_DIM_COUNT; i++) {
            for (var j = 0; j < CATEGORY_DIM_COUNT; j++) {
                if (CATEGORY_DIM_COUNT - i >= CATEGORY_DIM_COUNT + 1) {
                    continue;
                }

                option.grid.push({
                    left: BASE_LEFT + i * (GRID_WIDTH + GAP) + '%',
                    top: BASE_TOP + j * (GRID_HEIGHT + GAP) + '%',
                    width: GRID_WIDTH + '%',
                    height: GRID_HEIGHT + '%'
                });

                option.brush.xAxisIndex && option.brush.xAxisIndex.push(index);
                option.brush.yAxisIndex && option.brush.yAxisIndex.push(index);

                option.xAxis.push({
                    splitNumber: 3,
                    position: 'top',
                    axisLine: {
                        show: j === 0,
                        onZero: false
                    },
                    axisTick: {
                        show: j === 0,
                        inside: true
                    },
                    axisLabel: {
                        show: j === 0
                    },
                    type: 'value',
                    gridIndex: index,
                    scale: true
                });

                option.yAxis.push({
                    splitNumber: 3,
                    position: 'right',
                    axisLine: {
                        show: i === CATEGORY_DIM_COUNT - 1,
                        onZero: false
                    },
                    axisTick: {
                        show: i === CATEGORY_DIM_COUNT - 1,
                        inside: true
                    },
                    axisLabel: {
                        show: i === CATEGORY_DIM_COUNT - 1
                    },
                    type: 'value',
                    gridIndex: index,
                    scale: true
                });

                option.series.push({
                    type: 'scatter',
                    symbolSize: SYMBOL_SIZE,
                    xAxisIndex: index,
                    yAxisIndex: index,
                    data: retrieveScatterData(rawData, i, j)
                });

                option.visualMap.seriesIndex.push(option.series.length - 1);

                index++;
            }
        }
    }


    var option = {
        animation: false,
        brush: {
            brushLink: 'all',
            xAxisIndex: [],
            yAxisIndex: [],
            inBrush: {
                opacity: 1
            }
        },
        visualMap: {
            type: 'piecewise',

            dimension: CATEGORY_DIM,
            orient: 'horizontal',
            top: 10,
            left: 'center',
            inRange: {
                color: ['#c23531', '#2f4554', '#61a0a8']
            },
            outOfRange: {
                color: '#ddd'
            },
            seriesIndex: [0]
        },
        tooltip: {
            trigger: 'item'
        },

        parallel: {
            bottom: '4%',
            left: '5%',
            height: '31%',
            width: '60%',
            parallelAxisDefault: {
                type: 'value',
                name: '',
                nameLocation: 'end',
                nameGap: 20,
                splitNumber: 3,
                nameTextStyle: {
                    fontSize: 14
                },
                axisLine: {
                    lineStyle: {
                        color: '#555'
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: '#555'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    color: '#555'
                }
            }
        },
        grid: [],
        xAxis: [],
        yAxis: [],
        series: [
            {
                name: 'parallel',
                type: 'parallel',
                smooth: true,
                lineStyle: {
                    width: 40,
                    opacity: 0.3
                },
                data: rawData
            }
        ]
    };

    generateGrids(option);

    myChart.setOption(option);
}
