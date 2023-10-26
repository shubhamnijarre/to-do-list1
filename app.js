const express=require("express");
const bodyparser=require("body-parser");
const { default: mongoose } = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",
   { useNewUrlParser: true });

const ap=express();
ap.use(bodyparser.urlencoded({extended:true}));
ap.set('view engine', 'ejs');
ap.use(express.static("public"));

var litem= [];
var worklist=[];

const listitem= new mongoose.Schema({
items:String,

})


const item= mongoose.model("item",listitem)

const apple= new item({
  items:"apple"

})
const book=new item(
  {
    items:"book"
  }
)
/*item.insertMany([apple,book],function (err) {
  if(err)
  {
    console.log("error")
  }
  else{
    console.log("no error")
  }
  })*/
  const welcome=new item(
    {
      items:"welcome to our to do list"
    }
  )
  const add= new item(
    {
      items:"press + to add"
    }
  )
  const default1=[welcome,add]
  const listschema={
    name:String,
    items:[listitem]

  }
  const List=mongoose.model("List",listschema)
  
ap.get("/",function(req,res)
{
  var today=new Date();
  var currentday=today.getDay();
  
  var options={
      weekday:'long',
      day:'numeric',
      month:'long'
  };
  var day=today.toLocaleDateString("hin-IN",options);
  console.log(currentday);
    item.find({},function(err,founditems)
    {
           if(founditems.length===0)
           {
            item.insertMany(default1,function (err) {
              if(err)
              {
                console.log("error")
              }
              else{
                console.log("no error")
              }
              })
              res.redirect("/")
             
           }
           else{

      console.log(founditems)
      res.render("list",{kindofday:"thisday",listitems:founditems});
           }
    })
   
   
    
    ap.post("/delete",function(req,res)
    {
      const id=req.body.checkitems
      console.log(id)
      const title3=req.body.listname1
      const ap=title3.trim()
  
    
    
   if(title3==="thisday")
   {
    
  item.findByIdAndDelete(id,function(er)
  {
    if(!er)
    {
      console.log(" deleted")
      res.redirect("/")
    }
    else{
      console.log(" not deletd")
      
    }
    
  })
}
else
{
  List.findOneAndUpdate({name:title3},{$pull:{items:{_id:id }}},function(err)
  {
  if(!err)
  {
    console.log("delete")
    res.redirect("/"+ap)
  }
  })
}
  //List.findByIdAndDelete()
  /*if(ap==="thisday")
  {
      item.findByIdAndDelete(id,function(er)
      {
        if(er)
        {
          console.log("not deleted")
        }
        else{
          console.log("deletd")
        }
      })
    }
  /*  else
  {
      List.findByIdAndDelete(id,function(er)
      {
        if(er)
        {
          console.log("not deleted")
          res.redirect("/"+ap)
        }
        else{
          console.log("deletd")
        }
      })
    }*/
  })

    
});

ap.post("/",function(req,res)
{
    const newitems=req.body.items;
    const title1=req.body.list
  
    console.log(title1)
 const ap=title1.trim()
    
    const newitems1= new item({
      items:newitems

    })
    if( ap==="thisday")
    {
      console.log("ind")
      console.log("in if")
      newitems1.save()
    
      res.redirect("/")
    }
    else{
      List.findOne({name:ap},function (err,foundlist) {


        foundlist.items.push(newitems1)
        foundlist.save()
        res.redirect("/"+title1.trim())
        })
        
    }
  
    /*if( req.body.list === "today2" )
    {
      console.log("in if")
      newitems1.save()
    
      res.redirect("/")
    }
    else{
      List.findOne({name:title1},function(err,foundlist)
      {
        
        
     console.log(foundlist)
     foundlist.items.push(newitems1)
      
      foundlist.save()
        res.redirect("/"+title1)
      })
    }*/
   
    
    
    //console.log(ss);
    
  /*  if(!req.body.list)
    {
      litem.pop(ss)
    }
    else{
    litem.push(ss);
    }
    res.redirect("/");
    */
    
})


ap.get("/:customlist",function(req,res)
{
  const listname=req.params.customlist
  List.findOne({name:listname},function(err,result)
  {
    if(!err)
    {
          if(!result)
          {//create a new list
            const list=new List(
              {
                name:listname,
                items:default1
              }
            )
            list.save()
          }
          else{
            res.render("list",{kindofday:result.name,listitems:result.items})
          }
    
    
    
  }
  })
 /* const list=new List(
    {
      name:listname,
      items:default1
    }
  )
  list.save()*/
  
})
ap.get("/work",function (req,res) {
    res.render("list",{kindofday:"work list",listitems:worklist});
  
    
  });
  ap.post("/work",function(req,res)
  {  
    var item=req.body.items;
    worklist.push(item);
    res.redirect("/work");
    console.log(req.body);

  })
  ap.get("/about",function(req,res)
  {
      res.render("about");
  })
 ap.listen("2000",function (req,res) {

    console.log("working...");
  });
 