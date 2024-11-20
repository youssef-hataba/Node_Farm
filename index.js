const fs = require("fs");
const http = require("http");
const url = require("url");

// blocking synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `youssef ${textIn}`;
// console.log(textOut);

// fs.writeFileSync(`./txt/output.text`, textOut);

// console.log("file written");

// // Non-blocking , asynhronous way
// fs.readFile("./txt/start.txt", 'utf-8', (err,data) => {
//   console.log(data);
// });

// console.log('will read file');

const replaceTemplate=(temp,product)=>{
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  
  if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
}

const tempOverview=fs.readFileSync('./templates/template-overview.html','utf-8');
const tempCard=fs.readFileSync('./templates/template-card.html','utf-8');
const tempProduct=fs.readFileSync('./templates/template-product.html','utf-8');

const data= fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj=JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200,{'Content-type':'text/html'});
  
    const cardsHtml=dataObj.map(ele=>replaceTemplate(tempCard,ele)).join('');
    const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
    res.end(output);

  } else if (pathName === "/product") {
    res.end("this is the product page ");
  } else if (pathName === "/api") {

    res.writeHead(200,{'Content-type':'application/json'});
    res.end(data);
    
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end('<h1 style="color:red">Page Not Found</h1>');
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log(`listiening of request on port 3000`);
});
