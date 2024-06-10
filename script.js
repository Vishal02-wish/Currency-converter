$(document).ready(function () {
  $.get("https://restcountries.com/v3.1/all", function (data) {
    data.sort(function (a, b) {
      return a.name.common.localeCompare(b.name.common);
    });

    data.forEach(function (country) {
      var countryName = country.name.common;
      var currencies = country.currencies;
      var currencyValues = [];

      for (const currencyCode in currencies) {
        currencyValues.push(" (" + currencyCode + ")");
      }

      $("#fromCurrency, #toCurrency").append(
        "<option>" + countryName + currencyValues.join(", ") + "</option>"
      );
    });
  }).fail(function () {
    console.error("Failed to fetch countries data.");
  });

  $(".btn-convert").click(function () {
    convertCurrency();
  });

  $(".btn-exchange").click(function () {
    exchangeCurrencies();
  });

  function convertCurrency() {
    const fromCurrency = $("#fromCurrency")
      .val()
      .match(/\((.*)\)/)[1];
    const toCurrency = $("#toCurrency")
      .val()
      .match(/\((.*)\)/)[1];
    const amount = $(".from-amount").val();

    $.ajax({
      url: "https://api.exchangerate-api.com/v4/latest/" + fromCurrency,
      type: "GET",
      success: function (response) {
        const exchangeRate = response.rates[toCurrency];
        const convertedAmount = (amount * exchangeRate).toFixed(2);
        $(".to-amount").val(convertedAmount);
      },
      error: function () {
        console.error("Failed to fetch exchange rates.");
      },
    });
  }

  function exchangeCurrencies() {
    const temp = $("#fromCurrency").val();
    $("#fromCurrency").val($("#toCurrency").val());
    $("#toCurrency").val(temp);
  }
});