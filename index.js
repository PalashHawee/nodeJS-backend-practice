const fs = require("fs");
const htttp = require("http");
const url = require("url");

//Helper Functions
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/%PRODUCTNAME%/g, product.productName);
  output = output.replace(/%IMAGE%/g, product.image);
  output = output.replace(/%PRICE%/g, product.price);
  output = output.replace(/%FROM%/g, product.from);
  output = output.replace(/%QUANTITY%/g, product.quantity);
  output = output.replace(/%DESCRIPTION%/g, product.description);
  output = output.replace(/%FROM%/g, product.from);
  output = output.replace(/%NUTRIENTS%/g, product.nutrients);
  output = output.replace(/%ID%/g, product.id);
  if (!product.organic)
    output = output.replace(/%NOT_ORGANIC%/g, "not-organic");
  return output;
};

//Template Overview Reading
const tempOverview = fs.readFileSync(
  `${__dirname}/node-farm/templates/template-overview.html`,
  "utf-8"
);

//Template Card reading
const tempCard = fs.readFileSync(
  `${__dirname}/node-farm/templates/template-card.html`,
  "utf-8"
);

//Template Product reading
const tempProduct = fs.readFileSync(
  `${__dirname}/node-farm/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(
  `${__dirname}/node-farm/dev-data/data.json`,
  "utf-8"
);
const dataObj = JSON.parse(data);

const server = htttp.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("%PRODUCT_CARDS%", cardHtml);

    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API page
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    ///Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page Not Found!</h1>");
  }
});
server.listen(3000, "127.0.0.1", () => {
  console.log("Listening to requests on port 3000");
});
