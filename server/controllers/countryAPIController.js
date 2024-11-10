const axios = require("axios");

const getAllCountries = async (req, res) => {
  try {
    const query = await axios
      .get("https://www.universal-tutorial.com/api/countries/", {
        headers: {
          Authorization: `Bearer ${process.env.COUNTRY_AUTH_TOKEN}`,
          Accept: "application/json",
        },
      })
      .then(({ data }) => {
        return data
          .map((item) => ({
            label: item.country_name,
            value: item.country_name,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)); // Urutkan A-Z berdasarkan label
      })
      .catch((err) => {
        console.log(err);
      });

    return res.status(200).json({
      message: "Successfully get all country",
      results: query,
    });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getStateBySelectedCountry = async (req, res) => {
  const { state } = req.query;

  try {
    if (state) {
      const query = await axios
        .get(`https://www.universal-tutorial.com/api/states/${state}`, {
          headers: {
            Authorization: `Bearer ${process.env.COUNTRY_AUTH_TOKEN}`,
            Accept: "application/json",
          },
        })
        .then(({ data }) => {
          return data
            .map((item) => ({
              label: item.state_name,
              value: item.state_name,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)); // Urutkan A-Z berdasarkan label
        })
        .catch((err) => {
          console.log(err);
        });

      return res.status(200).json({
        message: "Successfully get all states",
        results: query,
      });
    }
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllCountries, getStateBySelectedCountry };
