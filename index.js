const express =  require("express");
const app = express();
const port = process.env.Port | 5000;

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
const sql_brand = "select * from brands";

conn.query(sql_brand,function (err,data){
    if(err) res.send("Not Found 404");
    else{
        brandList = data;
    }
});



var bodyList =[];
const sql_body = "select * from bodystyles";

conn.query(sql_body,function (err,data){
    if(err) res.send("Not Found 404");
    else{
        bodyList = data;
    }
});

var yearList =[];
const sql_year = "select distinct Year from cars ";
conn.query(sql_year,function (err,data){
    if(err) res.send("Not Found 404");
    else{
        yearList = data;
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
app.get("/",function (req, res) {
    const sql_txt ="select CID,Image1,Name,Year,Price,HotCars,Fueltype,BrName,BodyStyle,Discount,Percent from cars inner join fueltypes on cars.FtID = fueltypes.FtID inner join brands on cars.BrId=brands.BrId inner join bodystyles on cars.BdID=bodystyles.BdID" ;

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
app.get("/aboutus",function (req, res) {
    res.render("aboutus",{
        "brandList":brandList,
    });
});

app.get("/creation",function (req, res) {
    res.render("creation",{
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
app.get("/accessories",function (req, res) {
    res.render("accessories",{
        "brandList":brandList,
    });
});
app.get("/contact",function (req, res) {
    res.render("contact",{
        "brandList":brandList,
    });
});


app.get("/warranty",function (req,res){
    const BrName = req.query.BrName;
    res.render("warranty",{
        "brandList":brandList,
    });

});

app.get("/list-product",function (req, res) {
    var BrName = req.query.BrName;
    var sql_list ="select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where BrName like '"+BrName+"' order by Price*Percent/100 asc;"+
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
                "brnameList":brnameList,
                "yearList": yearList,

            })
        }

    });
});
app.get("/product",function (req,res) {
    var selectBrand = req.query.selectBrand;
    var selectYear = req.query.selectYear;
    var selectBody = req.query.selectBody;
    var orderBy = req.query.orderBy;
    var selectPrice = req.query.selectPrice;
    var sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID order by Price*Percent/100 asc";
    if (selectBrand == "Select Brand" && selectBrand != undefined && selectYear == "Select Year" && selectYear != undefined && selectBody == "Select Body" && selectBody != undefined && selectPrice == "Select Price" && selectPrice != undefined) {
        sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID";
    }
    if (selectBrand != "Select Brand" && selectBrand != undefined && selectYear == "Select Year" && selectYear != undefined && selectBody != "Select Body" && selectBody != undefined && selectPrice == "Select Price" && selectPrice != undefined) {
        sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and BodyStyle like '%" + selectBody + "%'";
    }
    if (selectBrand != "Select Brand" && selectBrand != undefined && selectYear != "Select Year" && selectYear != undefined && selectBody != "Select Body" && selectBody != undefined && selectPrice == "Select Price" && selectPrice != undefined) {
        sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and Year like '%" + selectYear + "%' and BodyStyle like '%" + selectBody + "%'";
    }
    if (selectBrand == "Select Brand" && selectBrand != undefined && selectYear != "Select Year" && selectYear != undefined && selectBody != "Select Body" && selectBody != undefined && selectPrice == "Select Price" && selectPrice != undefined) {
        sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Year like '%" + selectYear + "%' and BodyStyle like '%" + selectBody + "%'";
    }
    if (selectBrand == "Select Brand" && selectBrand != undefined && selectYear == "Select Year" && selectYear != undefined && selectBody != "Select Body" && selectBody != undefined && selectPrice == "Select Price" && selectPrice != undefined) {
        sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where  BodyStyle like '%" + selectBody + "%'";
    }
    if (selectBrand == "Select Brand" && selectBrand != undefined && selectYear != "Select Year" && selectYear != undefined && selectBody == "Select Body" && selectBody != undefined && selectPrice == "Select Price" && selectPrice != undefined) {
        sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Year like '%" + selectYear + "%'";
    }
    if (selectBrand != "Select Brand" && selectBrand != undefined && selectYear == "Select Year" && selectYear != undefined && selectBody == "Select Body" && selectBody != undefined && selectPrice == "Select Price" && selectPrice != undefined) {
        sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%'";
    }
    if (selectBrand != "Select Brand" && selectBrand != undefined && selectYear != "Select Year" && selectYear != undefined && selectBody == "Select Body" && selectBody != undefined && selectPrice == "Select Price" && selectPrice != undefined) {
        sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and Year like '%" + selectYear + "%'";
    }
    if (selectBrand != "Select Brand" && selectBrand != undefined && selectYear != "Select Year" && selectYear != undefined && selectBody == "Select Body" && selectBody != undefined && selectPrice != undefined) {
        if (selectPrice == 0) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and Year like '%" + selectYear + "%' and Price*Percent/100 <= "+50000+"";
        }
        if (selectPrice == 1) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and Year like '%" + selectYear + "%' and Price*Percent/100 > +"+50000+" and Price*Percent/100 <= "+150000+"";
        }
        if (selectPrice == 2) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and Year like '%" + selectYear + "%' and Price*Percent/100 > "+150000+" and Price*Percent/100 <= "+300000+"";
        }
        if (selectPrice == 3) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and Year like '%" + selectYear + "%' and Price*Percent/100> "+300000+" and Price*Percent/100 <= "+500000+"";
        }
    }
    if (selectBrand != "Select Brand" && selectBrand != undefined && selectYear == "Select Year" && selectYear != undefined && selectBody != "Select Body" && selectBody != undefined && selectPrice != undefined) {
        if (selectPrice == 0) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and BodyStyle like '%" + selectBody + "%' and Price*Percent/100 <= "+50000+"";
        }
        if (selectPrice == 1) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and BodyStyle like '%" + selectBody + "%' and Price*Percent/100 > +"+50000+" and Price*Percent/100 <= "+150000+"";
        }
        if (selectPrice == 2) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and BodyStyle like '%" + selectBody + "%' and Price*Percent/100 > "+150000+" and Price*Percent/100 <= "+300000+"";
        }
        if (selectPrice == 3) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and BodyStyle like '%" + selectBody + "%' and Price*Percent/100> "+300000+" and Price*Percent/100 <= "+500000+"";
        }
    }
    if (selectBrand == "Select Brand" && selectBrand != undefined && selectYear != "Select Year" && selectYear != undefined && selectBody != "Select Body" && selectBody != undefined && selectPrice != undefined) {
        if (selectPrice == 0) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Year like '%" + selectYear + "%' and BodyStyle like '%" + selectBody + "%' and Price*Percent/100 <= "+50000+"";
        }
        if (selectPrice == 1) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Year like '%" + selectYear + "%' and BodyStyle like '%" + selectBody + "%' and Price*Percent/100 > +"+50000+" and Price*Percent/100 <= "+150000+"";
        }
        if (selectPrice == 2) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Year like '%" + selectYear + "%' and BodyStyle like '%" + selectBody + "%' and Price*Percent/100 > "+150000+" and Price*Percent/100 <= "+300000+"";
        }
        if (selectPrice == 3) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Year like '%" + selectYear + "%' and BodyStyle like '%" + selectBody + "%' and Price*Percent/100> "+300000+" and Price*Percent/100 <= "+500000+"";
        }
    }
    if (selectBrand != "Select Brand" && selectBrand != undefined && selectYear == "Select Year" && selectYear != undefined && selectBody == "Select Body" && selectBody != undefined && selectPrice != undefined) {
        if (selectPrice == 0) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and Price*Percent/100 <= "+50000+"";
        }
        if (selectPrice == 1) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and Price*Percent/100 > +"+50000+" and Price*Percent/100 <= "+150000+"";
        }
        if (selectPrice == 2) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and Price*Percent/100 > "+150000+" and Price*Percent/100 <= "+300000+"";
        }
        if (selectPrice == 3) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and Price*Percent/100> "+300000+" and Price*Percent/100 <= "+500000+"";
        }
    }
    if (selectBrand == "Select Brand" && selectBrand != undefined && selectYear != "Select Year" && selectYear != undefined && selectBody == "Select Body" && selectBody != undefined && selectPrice != undefined) {
        if (selectPrice == 0) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Year like '%" + selectYear + "%' and Price*Percent/100 <= "+50000+"";
        }
        if (selectPrice == 1) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Year like '%" + selectYear + "%' and Price*Percent/100 > +"+50000+" and Price*Percent/100 <= "+150000+"";
        }
        if (selectPrice == 2) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Year like '%" + selectYear + "%' and Price*Percent/100 > "+150000+" and Price*Percent/100 <= "+300000+"";
        }
        if (selectPrice == 3) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Year like '%" + selectYear + "%' and Price*Percent/100> "+300000+" and Price*Percent/100 <= "+500000+"";
        }
    }
    if (selectBrand == "Select Brand" && selectBrand != undefined && selectYear == "Select Year" && selectYear != undefined && selectBody != "Select Body" && selectBody != undefined && selectPrice != undefined) {
        if (selectPrice == 0) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where BodyStyle like '%" + selectBody + "%' and Price*Percent/100 <= "+50000+"";
        }
        if (selectPrice == 1) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where BodyStyle like '%" + selectBody + "%' and Price > +"+50000+" and Price*Percent/100 <= "+150000+"";
        }
        if (selectPrice == 2) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where BodyStyle like '%" + selectBody + "%' and Price > "+150000+" and Price*Percent/100 <= "+300000+"";
        }
        if (selectPrice == 3) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where BodyStyle like '%" + selectBody + "%' and Price> "+300000+" and Price*Percent/100 <= "+500000+"";
        }
    }
    if (selectBrand != "Select Brand" && selectBrand != undefined && selectYear != "Select Year" && selectYear != undefined && selectBody != "Select Body" && selectBody != undefined && selectPrice != undefined) {
        if (selectPrice == 0) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and Year like '%" + selectYear + "%' and BodyStyle like '%" + selectBody + "%' and Price*Percent/100 <= "+50000+"";
        }
        if (selectPrice == 1) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and Year like '%" + selectYear + "%' and BodyStyle like '%" + selectBody + "%' and Price*Percent/100 > +"+50000+" and Price*Percent/100 <= "+150000+"";
        }
        if (selectPrice == 2) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and Year like '%" + selectYear + "%' and BodyStyle like '%" + selectBody + "%' and Price*Percent/100 > "+150000+" and Price*Percent/100 <= "+300000+"";
        }
        if (selectPrice == 3) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Brname like '%" + selectBrand + "%' and Year like '%" + selectYear + "%' and BodyStyle like '%" + selectBody + "%' and Price*Percent/100> "+300000+" and Price*Percent/100 <= "+500000+"";
        }
    }
    if (selectBrand == "Select Brand" && selectBrand != undefined && selectYear == "Select Year" && selectYear != undefined && selectBody == "Select Body" && selectBody != undefined && selectPrice != undefined) {
        if (selectPrice == 0) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Price*Percent/100 <= "+50000+"";
        }
        if (selectPrice == 1) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Price*Percent/100 >"+50000+" and Price*Percent/100 <= "+150000+"";
        }
        if (selectPrice == 2) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Price*Percent/100 > "+150000+" and Price*Percent/100 <= "+300000+"";
        }
        if (selectPrice == 3) {
            sql_pro = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Price*Percent/100 > "+300000+" and Price*Percent/100 <= "+500000+"";
        }
    }

    if (orderBy == 0) {
        sql_pro += " order by Price*Percent/100 asc"
    }
    if (orderBy == 1) {
        sql_pro += " order by Price*Percent/100 desc"
    }
    if (orderBy == 2) {
        sql_pro += " order by Price*Percent/100 asc"
    }
    if (orderBy == 3) {
        sql_pro += " order by Year desc"
    }
    if (orderBy == 4) {
        sql_pro += " order by Year asc"
    }
    conn.query(sql_pro, function (err, data) {
        if (err) res.send("404 NOT FOUND");
        else {
            var carlist = data;
            res.render("product", {
                "brandList": brandList,
                "carlist": carlist,
                "yearList": yearList,
                "bodyList": bodyList,
                "selectBrand":selectBrand,
                "selectYear":selectYear,
                "selectBody":selectBody,
                "selectPrice":selectPrice,
                "orderBy":orderBy
            })
        }
    });
});

app.get("/search",function(req,res) {
    const search = req.query.search;
    const sql_search = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where Name like '%"+search+"%' or BodyStyle like '%"+search+"%' or Fueltype like '%"+search+"%' or BrName like '%"+search+"%' or Year like '"+search+"' ";
    // res.send(sql_search)
    conn.query(sql_search, function (err, data) {
        if (err) res.send("404 Not Found");
        else {
            var searchList = data;
            res.render("search", {
                "searchList": searchList,
                "brandList":brandList,
                "yearList":yearList,
                "carsList": carsList,
                "bodyList":bodyList
            })
        }
    })
});
app.get("/car-detail",function(req,res) {
    const cid = req.query.id;
    const sql_cardetail = "select * from cars inner join brands on cars.BrID=brands.BrID inner join bodystyles on cars.BdID=bodystyles.BdID inner join fueltypes  on cars.FtID=fueltypes.FtID where CID like '%"+cid+"%'";
    // res.send(sql_cardetail)
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