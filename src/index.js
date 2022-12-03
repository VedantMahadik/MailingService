const { MongoClient, ObjectId } = require("mongodb");
var nodemailer = require("nodemailer");

const uri =
  "mongodb+srv://bamblebam:burhanu76@cluster0.qctjj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function listDatabases(client) {
  const database = await client.db("myFirstDatabase");
  return database;
}

const getAllInventories = async () => {
  await client.connect();
  const database = await listDatabases(client);
  const inventories = await database.collection("inventory").find().toArray();
  inventories.forEach(async inventory => {
    let obj = {};
    obj.name = inventory.name;
    obj.email = inventory.email;
    obj.items = [];
    if (inventory.inventoryItems && inventory.inventoryItems.length > 0) {
      for await (item of inventory.inventoryItems) {
        let result = await getInventoryItems(database, item);
        obj.items.push(result);
      }
    } else {
      obj.items = [""];
    }
    mailInventories(obj);
  });
};

const getInventoryItems = async (database, itemId) => {
  const item = await database
    .collection("inventoryItem")
    .find(
      { _id: ObjectId(itemId) },
      { projection: { _id: 0, name: 1, description: 1, quantity: 1 } },
    )
    .toArray();
  return item[0];
};

const mailInventories = obj => {
  const email = obj.email;
  const name = obj.name;
  const items = obj.items;
  let html = `<h1>INVENTORY UPDATE FOR: ${name}</h1>
  <table style="border-collapse: collapse">
  <tr style="border: 1px solid black">
    <th style="border: 1px solid black">Name</th>
    <th style="border: 1px solid black">Description</th>
    <th style="border: 1px solid black">Quantity</th>
  </tr>`;
  if (items.length == 1 && items[0] === "") {
    html =
      "<h1>INVENTORY UPDATE FOR: ${name}</h1> <p>No inventory items found...</p>";
  } else {
    items.forEach(item => {
      html += `<tr style="border: 1px solid black">
      <td style="border: 1px solid black">${item.name}</td>
      <td style="border: 1px solid black">${item.description}</td>
      <td style="border: 1px solid black">${item.quantity}</td>
      </tr>`;
    });
    html += "</table>";
  }

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "inventorymanagerccetia2@gmail.com",
      pass: "kxvqbvjnmahwbyqy",
      // pass: "inventory@CCET@Manager@IA@2",
    },
  });

  var mailOptions = {
    from: "gavinsignaturebox@gmail.com",
    to: email,
    subject: "Inventory Update",
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return;
};

const main = async () => {
  getAllInventories();
};

main();
