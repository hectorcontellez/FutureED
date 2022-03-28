$(document).ready(function() {
  // se agregua un detector de eventos (performSearch) al formulario
  $("#query-form").submit(function(event) { performSearch(event); });
});


var pat,flag=0;
function formatSearchResults(jsonResults) {

  var jsonObject = jsonResults;
    $("#search-results-heading").text("Resultados escontrados");
    var formatedText = "";

    jsonObject.Countries.forEach(
      function(item, index) {
        if(item.Country.toLowerCase()==pat.toLowerCase()){
        var thumbnail = item.NewConfirmed;
       formatedText += "<div class='dish-ingredients-div'><h3>Total Confirmados: " + item.TotalConfirmed + "<h3></div>";
       formatedText += "<div class='dish-ingredients-div'><h3>Nuevas muertes: " + item.NewDeaths + "<h3></div>";
       formatedText += "<div class='dish-ingredients-div'><h3>Nuevos confirmados: " + item.NewConfirmed + "<h3></div>";
       formatedText += "<div class='dish-ingredients-div'><h3>Recuperados: " + item.NewRecovered + "<h3></div>";
       flag=1;
        return;
      }
    }
    );

$("#results").html(formatedText);
  if(!flag){setNotFoundMessages();}
}

function performSearch(event) {
  // Variable para retener la solicitud
  var request;

  // Evite la publicación predeterminada del formulario: póngalo aquí para trabajar en caso de errores
  event.preventDefault();

  // Cancelar cualquier solicitud pendiente
  if (request) {
      request.abort();
  }
  // Se configurar algunas variables locales
  var $form = $(this);

  // Se deshabilita las entradas y los botones mientras dure la solicitud.
  setFormDisabledProps(true);

  $("#search-results-heading").text("Searching ...");
  $("#results").text("");

  // Enviar la solicitud
  request = $.ajax({
      url:"https://api.covid19api.com/summary",
      type: "GET",
     // data: { i: , q: $("#contains").val()}
  });

pat=$("#ingredients").val();

  // Controladora de devolución de llamada

  request.done(function (response,textStatus, jqXHR){
    formatSearchResults(response);
    console.log(pat)
  });

  // Controlador de devolución de llamada

  request.fail(function (jqXHR, textStatus, errorThrown){
      $("#search-results-heading").text("Sorry We Unable to fetch Covid Data.Try again.");
      $("#results").text("");
  });

  // Controlador de devolución de llamada que se llamará en cualquier caso

  request.always(function () {
      // Reenable the inputs
      setFormDisabledProps(false);
  });

}

// Esta función borra los resultados de la búsqueda y el encabezado "Resultados de la búsqueda"

function resetResults() {
  $("#search-results-heading").text("");
  $("#results").text("");
  flag=0;
}

// Esta función verifica los campos de entrada del usuario en busca de caracteres inaceptables
// Y las elimina si se encuentran

function sanitizeInputs() {
  var str = $("#ingredients").val();
  str = str.replace(/[^a-zA-Z 0-9,]/gim, "");
  str = str.trim();
  $("#ingredients").val(str);
}

// Esta función desactiva los campos de texto y los dos botones

function setFormDisabledProps(statusToSet) {
    document.getElementById("ingredients").disabled = statusToSet;
    document.getElementById("resetButton").disabled = statusToSet;
    document.getElementById("searchButton").disabled = statusToSet;
}
function setNotFoundMessages() {
  $("#search-results-heading").text("Pais no reconocido, ingrese un nombre valido.");
  $("#results").text("");
}

