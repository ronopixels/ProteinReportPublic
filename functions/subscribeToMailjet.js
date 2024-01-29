const axios = require("axios");

exports.handler = async (event) => {
  const parsedData = new URLSearchParams(event.body);
  const dataObj = {};
  for (var pair of parsedData.entries()) {
    dataObj[pair[0]] = pair[1];
  }
  console.log("DataObj: ", dataObj);
  const email = dataObj.email;

  // Get environment variables
  const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE, MJ_LIST_ID } = process.env;

  // Create the contact in Mailjet
  try {
    const response = await axios.post(
      "https://api.mailjet.com/v3/REST/contact",
      {
        IsExcludedFromCampaigns: "false",
        Email: email,
      },
      {
        auth: {
          username: MJ_APIKEY_PUBLIC,
          password: MJ_APIKEY_PRIVATE,
        },
      }
    );

    // Add the contact to the contact list
    await axios.post(
      `https://api.mailjet.com/v3/REST/contactslist/${MJ_LIST_ID}/managemanycontacts`,
      {
        Action: "addnoforce", //addforce,addnoforce,remove
        Contacts: [
          {
            Email: email,
          },
        ],
      },
      {
        auth: {
          username: MJ_APIKEY_PUBLIC,
          password: MJ_APIKEY_PRIVATE,
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Contact added to Mailjet successfully",
      }),
    };
  } catch (error) {
    console.error("Error adding contact to Mailjet:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to add contact to Mailjet",
      }),
    };
  }
};
