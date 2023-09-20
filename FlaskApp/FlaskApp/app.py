from flask import Flask, render_template


app = Flask(__name__)

@app.route("/australianbushfires2019/home")
def viewOne():
    return render_template('map_fire.html')

@app.route("/australianbushfires2019/data")
def viewTwo():
    return render_template('index3.html')


@app.route("/australianbushfires2019/satellitedata")
def viewThree():
    return render_template('linechart.html')

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=8000, debug=True)