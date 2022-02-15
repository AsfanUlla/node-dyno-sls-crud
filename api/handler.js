'use strict';
const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();
const TableName = "Moviess";

// Function to Create an Item to DB
module.exports.addItem = async (event, context, callback) => {
  try {

    const requestBody = JSON.parse(event.body);

    let year = requestBody.year;
    let title = requestBody.title;

    let params = {
      TableName: TableName,
      Item: {
        "year": year,
        "title": title,
        "info": {
          "plot": "Nothing happens at all",
          "rating": 0
        }
      }
    }

    let result = await docClient.put(params).promise();
    if (result) {
      console.log(">>>>>>>>>", result);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Movie Added",
        data: result.title
      }),
    };
  } catch (error) {
    console.log(error);
    return error;
  }
};

// Function to getAllItems from DB
module.exports.getAllItem = async (event, context, callback) => {
 
  const requestBody = JSON.parse(event.body);

  let params = {
    TableName: TableName
  };

  try {
    let result = await docClient.scan(params).promise();

    console.log(result);

    return {
      body: JSON.stringify({
        message: "Executed succesfully",
        data: result
      })
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to update an Item in DB
module.exports.updateItem = async (event, context, callback) => {

  const requestBody = JSON.parse(event.body);

  let title = requestBody.title;
  let rating = requestBody.rating;

  let params = {
    TableName: TableName,
    Key: {
      "title": title
    },
    UpdateExpression: "set info.rating = info.rating + :val",
    ExpressionAttributeValues: {
      ":val": rating
    },
    ReturnValues: "UPDATED_NEW"
  };

  try {
    let result = await docClient.update(params).promise();
    return {
      body: JSON.stringify({
        message: "updated succesfully",
        data: result
      })
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to Delete an item
module.exports.deleteItem = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  let title = requestBody.title;

  let params = {
    TableName: TableName,
    Key: {
      "title": title
    }
  }

  let result = await docClient.delete(params).promise();

  return {
    body: JSON.stringify({
      message: "deleted succesfully",
      data: result
    })
  }

}

