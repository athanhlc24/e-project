const express =  require("express");
const app = express();
const port = process.env.Port | 6789;

app.listen(port,function () {
    console.log("sever is running....");
});
app.set("view engine","ejs");
app.use(express.static("public"));

const mysql = require("mysql");
const conn = mysql.createConnection({
    host:"localhost",
    port:"3306",
    user:"root",
    password:"",
    database:"e-project",
    multipleStatements: true

});
var brandList =[];
const sql = "select * from brands";

conn.query(sql,function (err,data){
    if(err) res.send("Not Found 404");
    else{
        brandList = data;
    }
});
var carsList =[];
const sql_car = "select * from cars";

conn.query(sql_car,function (err,data){
    if(err) res.send("Not Found 404");
    else{
        carsList = data;
    }
});
function search(e){
    e.value
}
app.get("/",function (req, res) {
    const sql_txt ="select Name,Year,Price,HotCars,Fueltype from cars inner join fueltypes on cars.FtID = fueltypes.FtID" ;

    conn.query(sql_txt,function (err,data){
        if(err) res.send("Not Found 404");
        // res.send(data);
        else{
            var bestList = data;


            res.render("home",{
                "brandList":brandList,
                "bestList":bestList,
            });
        }
    })

});
app.get("/creation",function (req, res) {
    res.render("creation",{
        "brandList":brandList,
    });
});
app.get("/aboutus",function (req, res) {
    res.render("aboutus",{
        "brandList":brandList,
    });
});
app.get("/design",function (req, res) {
    res.render("design",{
        "brandList":brandList,
    });
});
app.get("/develop",function (req, res) {
    res.render("develop",{
        "brandList":brandList,
    });
});

app.get("/baohanh",function (req,res){
    const BrName = req.query.BrName;
    res.render("baohanh",{
        "brandList":brandList,
    });

});

app.get("/list-product",function (req, res) {
    const BrName = req.query.BrName;
    const search = req.query.search
    const sql_list ="select * from cars where BrID in(select BrID from brands where BrName like '"+BrName+"');"+
        "select BrName from brands where BrName like '"+BrName+"';"+
        "select BodyStyle from bodystyles inner join cars on bodystyles.BdID = cars.BdID where BrID in(select BrID from brands where BrName like '"+BrName+"');"+
        "select Fueltype from fueltypes inner join  cars on fueltypes.FtID = cars.FtID where BrID in(select BrID from brands where BrName like '"+BrName+"')";
    conn.query(sql_list,function (err,data) {
        if (err) res.send("404 NOT FOUND");
        // res.send(data)
        else{
            var listProduct = data[0];
            var bodyList = data[2];
            var fuelList = data[3];
            var brnameList =data[1][0];
            res.render("list-product",{
                "brandList":brandList,
                "listProduct": listProduct,
                "bodyList":bodyList,
                "fuelList":fuelList,
                "brnameList":brnameList
            })
        }

    });
});
app.get("/product",function (req,res) {
    const sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID";
    conn.query(sql_pro, function (err, data) {
        if (err) res.send("404 NOT FOUND");
        else{
            var carList=data;
            res.render("product", {
                "brandList": brandList,
                "carList": carList
            })
        }
    })
});
app.get("/car-price-list",function (req, res) {
    const sql_list ="select Name,Price from cars";
    conn.query(sql_list,function (err,data) {
        if (err) res.send("404 NOT FOUND");
        else{
            var carPriceList = data;
            res.render("car-price-list",{
                "carPriceList": carPriceList,
                "brandList":brandList,
            })
        }

    })
});
app.get("/search",function(req,res) {
    const search = req.query.search
    const sql_search = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Name like '%"+search+"%' or BodyStyle like '%"+search+"%' or Fueltype like '%"+search+"%' or BrName like '%"+search+"%' or Year like '"+search+"' ";
    // res.send(sql_search)
    conn.query(sql_search, function (err, data) {
        if (err) res.send("404 Not Found");
        else {
            var searchList = data;
            res.render("search", {
                "searchList": searchList,
                "brandList":brandList,
            })
        }
    })
});
app.get("/car-detail",function(req,res) {

    const sql_cardetail = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID";
    // res.send(sql_search)
    conn.query(sql_cardetail, function (err, data) {
        if (err) res.send("404 Not Found");
        else {
            var carDetail = data;
            res.render("car-detail", {
                "carDetail": carDetail,
                "brandList":brandList,
            })
        }
    })
});